import json
import asyncio
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import EventModel
from app.schemas import AtlasEventCreate, AtlasEventResponse
from app.websocket_manager import ws_manager
from app.routers.system import update_system_state_from_event, system_state
from app.core.processor import AtlasCoreProcessor

router = APIRouter(prefix="/api/events", tags=["Events"])

def model_to_dict(model: EventModel) -> dict:
    data_dict = {}
    if model.data_json:
        try:
            data_dict = json.loads(model.data_json)
        except Exception:
            data_dict = {}

    return {
        "id": model.event_id,
        "timestamp": model.timestamp,
        "source": model.source,
        "type": model.event_type,
        "message": model.message,
        "status": model.status,
        "data": data_dict
    }

@router.get("", response_model=List[AtlasEventResponse])
def get_events(
    limit: int = Query(50, ge=1, le=200),
    source: Optional[str] = None,
    event_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(EventModel)
    if source:
        query = query.filter(EventModel.source == source.upper())
    if event_type:
        query = query.filter(EventModel.event_type == event_type)
    
    events = query.order_by(EventModel.id.desc()).limit(limit).all()
    return [model_to_dict(evt) for evt in events]

@router.get("/{event_id}", response_model=AtlasEventResponse)
def get_event_by_id(event_id: str, db: Session = Depends(get_db)):
    event = db.query(EventModel).filter(EventModel.event_id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id '{event_id}' not found"
        )
    return model_to_dict(event)

@router.post("", response_model=AtlasEventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(event_in: AtlasEventCreate, db: Session = Depends(get_db)):
    # Check duplicate
    existing = db.query(EventModel).filter(EventModel.event_id == event_in.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Event with id '{event_in.id}' already exists"
        )

    db_event = EventModel(
        event_id=event_in.id,
        timestamp=event_in.timestamp,
        source=event_in.source,
        event_type=event_in.type,
        message=event_in.message,
        status=event_in.status,
        data_json=json.dumps(event_in.data)
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    event_payload = model_to_dict(db_event)

    # Update System State
    update_system_state_from_event(event_in.source, event_in.status, event_in.timestamp)

    # Broadcast via WebSocket
    await ws_manager.broadcast(event_payload)

    # Automatic Core Processing for VISION or SENSE events
    if event_in.source in ["VISION", "SENSE"]:
        AtlasCoreProcessor.process_event(db, db_event)

    return event_payload

@router.post("/demo")
async def trigger_demo_sequence(db: Session = Depends(get_db)):
    """
    Triggers complete demo sequence:
    STEP 1: VISION "Person detected"
    STEP 2: SENSE "Motion/context received"
    STEP 3 & 4: CORE Context Evaluation & Decision Generated
    STEP 5: ACT "Approved mission initiated"
    """
    timestamp_base = int(datetime.now(timezone.utc).timestamp() * 1000)

    # Step 1: VISION Event
    evt1 = EventModel(
        event_id=f"EVT-DEMO-V1-{timestamp_base}",
        timestamp=datetime.now(timezone.utc).isoformat(),
        source="VISION",
        event_type="PERSON_DETECTED",
        message="Person detected @ Sector 7 perimeter zone",
        status="ACTIVE",
        data_json=json.dumps({"target_id": "ATLAS-P001", "confidence": 0.994})
    )
    db.add(evt1)
    db.commit()
    db.refresh(evt1)

    system_state["current_state"] = "INVESTIGATING"
    system_state["vision_status"] = "ACTIVE"
    await ws_manager.broadcast(model_to_dict(evt1))
    await asyncio.sleep(1.0)

    # Step 2: SENSE Event
    evt2 = EventModel(
        event_id=f"EVT-DEMO-S2-{timestamp_base}",
        timestamp=datetime.now(timezone.utc).isoformat(),
        source="SENSE",
        event_type="MOTION_RECEIVED",
        message="Motion or environmental context received @ SENSE-NODE-01",
        status="ACTIVE",
        data_json=json.dumps({"sensor_node": "SENSE-NODE-01", "distance_m": 2.4, "floor_load_kg": 72.4})
    )
    db.add(evt2)
    db.commit()
    db.refresh(evt2)

    system_state["sense_status"] = "ACTIVE"
    await ws_manager.broadcast(model_to_dict(evt2))
    await asyncio.sleep(1.0)

    # Step 3 & 4: Automatic Core Processing
    decision_result = AtlasCoreProcessor.process_event(db, evt2)
    system_state["current_state"] = "RESPONDING"
    await asyncio.sleep(1.0)

    return {
        "status": "completed",
        "demo_sequence": "VISION -> SENSE -> CORE CONTEXT -> CORE DECISION -> ACT",
        "core_decision": decision_result,
        "current_system_state": system_state["current_state"]
    }
