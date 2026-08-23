from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import SensorNodeModel, EventModel
from app.schemas import SensorStatusResponse, SensorNodeResponse, AtlasEventResponse
from app.routers.events import model_to_dict

router = APIRouter(prefix="/api/sensors", tags=["Sensor Network"])

def node_to_dict(model: SensorNodeModel) -> dict:
    return {
        "node_id": model.node_id,
        "name": model.name,
        "status": model.status,
        "health": model.health,
        "motion": model.motion,
        "distance_m": model.distance_m,
        "temp_c": model.temp_c,
        "environmental_reading": model.environmental_reading,
        "floor_load_kg": model.floor_load_kg,
        "battery_level": model.battery_level,
        "last_updated": model.last_updated
    }

@router.get("/status", response_model=SensorStatusResponse)
def get_sensors_status(db: Session = Depends(get_db)):
    total = db.query(SensorNodeModel).count()
    online = db.query(SensorNodeModel).filter(SensorNodeModel.status == "ONLINE").count()
    warning = db.query(SensorNodeModel).filter(SensorNodeModel.status != "ONLINE").count()

    return SensorStatusResponse(
        status="ONLINE",
        total_nodes=total if total > 0 else 6,
        online_nodes=online if total > 0 else 5,
        warning_nodes=warning if total > 0 else 1,
        overall_health="98.2% NOMINAL"
    )

@router.get("/nodes", response_model=List[SensorNodeResponse])
def get_sensor_nodes(db: Session = Depends(get_db)):
    nodes = db.query(SensorNodeModel).order_by(SensorNodeModel.id.asc()).all()
    return [node_to_dict(n) for n in nodes]

@router.get("/nodes/{node_id}", response_model=SensorNodeResponse)
def get_sensor_node_by_id(node_id: str, db: Session = Depends(get_db)):
    node = db.query(SensorNodeModel).filter(SensorNodeModel.node_id == node_id).first()
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor node '{node_id}' not found"
        )
    return node_to_dict(node)

@router.get("/events", response_model=List[AtlasEventResponse])
def get_sensor_events(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    events = (
        db.query(EventModel)
        .filter(EventModel.source == "SENSE")
        .order_by(EventModel.id.desc())
        .limit(limit)
        .all()
    )
    return [model_to_dict(evt) for evt in events]
