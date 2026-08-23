import json
import logging
import asyncio
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

from app.models import EventModel, CoreDecisionModel
from app.core.context_engine import ContextEngine
from app.core.decision_engine import DecisionEngine
from app.websocket_manager import ws_manager
from app.routers.system import system_state

logger = logging.getLogger("atlas.core.processor")

class AtlasCoreProcessor:
    @staticmethod
    def process_event(db: Session, event: EventModel) -> Optional[Dict[str, Any]]:
        """
        Processes incoming VISION or SENSE events.
        Runs context fusion, rule evaluation, decision storage, and optional ACT event generation.
        """
        source = event.source.upper()
        if source not in ["VISION", "SENSE"]:
            logger.info(f"[ATLAS CORE] Skipping processing for source: {source}")
            return None

        logger.info(f"[ATLAS CORE] {source} EVENT RECEIVED: {event.event_id} ({event.message})")

        # Update System State to INVESTIGATING
        system_state["current_state"] = "INVESTIGATING"
        system_state["last_event_timestamp"] = event.timestamp

        # Fetch recent events to find complementary vision & sense events
        recent_events = (
            db.query(EventModel)
            .filter(EventModel.source.in_(["VISION", "SENSE"]))
            .order_by(EventModel.id.desc())
            .limit(10)
            .all()
        )

        vision_evt = None
        sense_evt = None

        for evt in recent_events:
            evt_dict = {
                "id": evt.event_id,
                "source": evt.source,
                "message": evt.message,
                "data": json.loads(evt.data_json) if evt.data_json else {}
            }
            if evt.source == "VISION" and not vision_evt:
                vision_evt = evt_dict
            elif evt.source == "SENSE" and not sense_evt:
                sense_evt = evt_dict

        # Prevent duplicate processing: check if this event pair has already generated a decision
        input_event_ids = []
        if vision_evt: input_event_ids.append(vision_evt["id"])
        if sense_evt: input_event_ids.append(sense_evt["id"])
        input_ids_str = ",".join(sorted(input_event_ids))

        existing_decision = (
            db.query(CoreDecisionModel)
            .filter(CoreDecisionModel.input_event_ids == input_ids_str)
            .first()
        )

        if existing_decision:
            logger.info(f"[ATLAS CORE] Duplicate event context detected ({input_ids_str}). Skipping redundant decision.")
            return None

        # 1. Run Context Fusion
        logger.info("[ATLAS CORE] EXECUTING CONTEXT FUSION")
        fused_context = ContextEngine.fuse_context(vision_evt, sense_evt)

        # 2. Run Deterministic Decision Engine
        eval_result = DecisionEngine.evaluate(fused_context)
        logger.info(f"[ATLAS CORE] ASSESSMENT: {eval_result['assessment']}")
        logger.info(f"[ATLAS CORE] DECISION: {eval_result['decision']}")

        # 3. Create and Persist Core Decision
        now_ts = int(datetime.now(timezone.utc).timestamp() * 1000)
        decision_id = f"DEC-{now_ts}-{uuid.uuid4().hex[:4]}"
        
        db_decision = CoreDecisionModel(
            decision_id=decision_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            input_event_ids=input_ids_str,
            context_summary=fused_context["combined_context"],
            assessment=eval_result["assessment"],
            decision=eval_result["decision"],
            approved_action=eval_result["approved_action"],
            current_state=eval_result["current_state"],
            confidence=eval_result["confidence"]
        )
        db.add(db_decision)
        db.commit()
        db.refresh(db_decision)

        # Update System State
        system_state["overall_status"] = "ONLINE"
        system_state["core_status"] = "ONLINE"
        system_state["act_status"] = "EXECUTING" if eval_result["action_approved"] else "READY"

        decision_payload = {
            "id": db_decision.decision_id,
            "decision_id": db_decision.decision_id,
            "timestamp": db_decision.timestamp,
            "input_event_ids": input_ids_str.split(",") if input_ids_str else [],
            "context_summary": db_decision.context_summary,
            "assessment": db_decision.assessment,
            "decision": db_decision.decision,
            "approved_action": db_decision.approved_action,
            "current_state": db_decision.current_state,
            "confidence": db_decision.confidence
        }

        # Also log a CORE event in events table
        core_event_id = f"EVT-CORE-{now_ts}-{uuid.uuid4().hex[:4]}"
        core_event = EventModel(
            event_id=core_event_id,
            timestamp=db_decision.timestamp,
            source="CORE",
            event_type="DECISION_GENERATED",
            message=f"Decision summary generated: {eval_result['decision']}",
            status="COMPLETED",
            data_json=json.dumps(decision_payload)
        )
        db.add(core_event)
        db.commit()

        # Broadcast Core Event via WebSocket (safely check if running loop)
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(ws_manager.broadcast({
                "id": core_event.event_id,
                "timestamp": core_event.timestamp,
                "source": "CORE",
                "type": "DECISION_GENERATED",
                "message": core_event.message,
                "status": "COMPLETED",
                "data": decision_payload
            }))
        except RuntimeError:
            pass

        # 4. If action approved, generate ACT Event
        if eval_result["action_approved"]:
            act_event_id = f"EVT-ACT-{now_ts}-{uuid.uuid4().hex[:4]}"
            act_event = EventModel(
                event_id=act_event_id,
                timestamp=db_decision.timestamp,
                source="ACT",
                event_type="MISSION_INITIATED",
                message=f"Approved mission initiated: {eval_result['approved_action']}",
                status="COMPLETED",
                data_json=json.dumps({
                    "mission_id": "MISSION #3804",
                    "unit": "SENTRY-ALPHA",
                    "decision_ref": decision_id
                })
            )
            db.add(act_event)
            db.commit()
            logger.info(f"[ATLAS CORE] ACT EVENT GENERATED: {act_event.event_id}")

            # Broadcast ACT Event via WebSocket
            try:
                loop = asyncio.get_running_loop()
                loop.create_task(ws_manager.broadcast({
                    "id": act_event.event_id,
                    "timestamp": act_event.timestamp,
                    "source": "ACT",
                    "type": "MISSION_INITIATED",
                    "message": act_event.message,
                    "status": "COMPLETED",
                    "data": {
                        "mission_id": "MISSION #3804",
                        "unit": "SENTRY-ALPHA",
                        "decision_ref": decision_id
                    }
                }))
            except RuntimeError:
                pass

        return decision_payload
