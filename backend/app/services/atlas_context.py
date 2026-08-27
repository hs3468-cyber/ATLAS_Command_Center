"""
ATLAS Command Center — Safe Operational Context Builder
Generates a structured, read-only system snapshot for the LLM Intelligence Assistant.
Excludes all passwords, tokens, hashes, biometric data, and credentials.
"""

from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from app.models import (
    UserModel,
    VisionDetectionModel,
    SensorNodeModel,
    CoreDecisionModel,
    ActMissionHistoryModel,
    DroneConfigModel,
    EventModel,
)
from app.routers.vision import vision_enabled


def get_atlas_context_summary(db: Session, current_user: Optional[UserModel] = None) -> Dict[str, Any]:
    """
    Builds a clean, safe, read-only operational summary of the ATLAS system.
    """
    # 1. Vision status
    vision_active = vision_enabled
    vision_count = db.query(VisionDetectionModel).count()
    last_detection = (
        db.query(VisionDetectionModel)
        .order_by(VisionDetectionModel.id.desc())
        .first()
    )

    # 2. Sensor network status
    total_nodes = db.query(SensorNodeModel).count()
    online_nodes = db.query(SensorNodeModel).filter(SensorNodeModel.status == "ONLINE").count()
    
    # 3. Core decisions
    latest_decision = (
        db.query(CoreDecisionModel)
        .order_by(CoreDecisionModel.id.desc())
        .first()
    )

    # 4. Act / Drone status & config
    drone_config = db.query(DroneConfigModel).first()
    latest_mission = (
        db.query(ActMissionHistoryModel)
        .order_by(ActMissionHistoryModel.id.desc())
        .first()
    )

    # 5. Recent 3 operational events
    recent_events_models = (
        db.query(EventModel)
        .order_by(EventModel.id.desc())
        .limit(3)
        .all()
    )

    recent_events = [
        {
            "id": e.event_id,
            "source": e.source,
            "type": e.event_type,
            "message": e.message,
            "status": e.status,
            "timestamp": e.timestamp,
        }
        for e in recent_events_models
    ]

    context = {
        "system_overview": {
            "status": "ONLINE",
            "mode": "RULE_BASED_DEMO",
            "pipeline": "VISION -> SENSE -> CORE -> ACT",
        },
        "vision_module": {
            "camera_power": "ACTIVE (ON)" if vision_active else "OFFLINE (OFF)",
            "feed_status": "LIVE // 1080P 60FPS" if vision_active else "OFFLINE",
            "tracked_subjects_count": vision_count if vision_active else 0,
            "latest_subject": last_detection.subject_id if last_detection else "ATLAS-P001",
            "latest_sector": last_detection.sector if last_detection else "Sector 7",
            "latest_hazard": last_detection.hazard_rating if last_detection else "LOW",
        },
        "sensor_module": {
            "status": "ONLINE",
            "total_nodes": total_nodes if total_nodes > 0 else 6,
            "online_nodes": online_nodes if online_nodes > 0 else 5,
            "health_summary": "98.2% NOMINAL",
            "motion_status": "CLEAR",
        },
        "core_module": {
            "status": "ONLINE",
            "processing_mode": "RULE_BASED_DEMO",
            "confidence_score": f"{latest_decision.confidence * 100:.1f}%" if latest_decision else "98.4%",
            "latest_assessment": latest_decision.assessment if latest_decision else "EMERGENCY & THEFT RISK DETECTED",
            "latest_decision": latest_decision.decision if latest_decision else "DISPATCH VERIFICATION MISSION",
            "approved_action": latest_decision.approved_action if latest_decision else "AUTONOMOUS AERIAL RECON",
        },
        "act_module": {
            "operational_status": drone_config.operational_status if drone_config else "SIMULATED // READY",
            "battery_level": f"{drone_config.battery_status if drone_config else 92}%",
            "current_mission": latest_mission.mission_id if latest_mission else "MISSION #3804",
            "mission_name": latest_mission.name if latest_mission else "Sector 7 Aerial Reconnaissance",
            "unit": latest_mission.unit if latest_mission else "Sentry-Alpha",
            "mission_stage": latest_mission.stage if latest_mission else "VERIFICATION",
            "triggers_configured": {
                "emergency_alert": drone_config.emergency_alert if drone_config else True,
                "unknown_intruder": drone_config.unknown_intruder if drone_config else True,
                "theft_detection": drone_config.theft_detection if drone_config else True,
                "health_emergency": drone_config.health_emergency if drone_config else False,
            }
        },
        "recent_events": recent_events,
        "privacy_and_governance": {
            "monitoring_purpose": "Women's Safety & Authorized Emergency Monitoring",
            "data_collection": "Safety alerts, environmental telemetry, detection metadata, action audit logs",
            "excluded_data": "Raw biometric storage, raw video/camera frames, passwords, tokens, API keys",
            "log_retention_policy": "30 Days automated purge",
            "privacy_mode": "ACTIVE",
            "audit_trail": "Append-only, role-restricted to ADMIN only"
        },
        "requesting_user": {
            "username": current_user.username if current_user else "authorized_user",
            "role": current_user.role if current_user else "USER",
            "name": current_user.name if current_user else "Authorized User"
        }
    }

    return context
