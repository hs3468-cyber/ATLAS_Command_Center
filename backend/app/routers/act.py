from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ActMissionHistoryModel
from app.schemas import ActStatusResponse, ActMissionResponse

router = APIRouter(prefix="/api/act", tags=["ATLAS Act"])

def mission_to_dict(model: ActMissionHistoryModel) -> dict:
    return {
        "mission_id": model.mission_id,
        "name": model.name,
        "unit": model.unit,
        "stage": model.stage,
        "progress": model.progress,
        "execution_status": model.execution_status,
        "battery_demo_value": model.battery_demo_value,
        "signal_demo_value": model.signal_demo_value,
        "telemetry_summary": model.telemetry_summary,
        "timestamp": model.timestamp
    }

@router.get("/status", response_model=ActStatusResponse)
def get_act_status(db: Session = Depends(get_db)):
    mission = db.query(ActMissionHistoryModel).filter(ActMissionHistoryModel.mission_id == "MISSION #3804").first()
    if not mission:
        mission = db.query(ActMissionHistoryModel).order_by(ActMissionHistoryModel.id.desc()).first()
    mission_id = mission.mission_id if mission else "MISSION #3804"

    return ActStatusResponse(
        status="READY",
        current_mission_id=mission_id,
        unit_status="SENTRY-ALPHA // STANDBY"
    )

@router.get("/mission", response_model=ActMissionResponse)
def get_current_act_mission(db: Session = Depends(get_db)):
    # Prioritize active demonstration mission #3804 for full pipeline consistency
    mission = db.query(ActMissionHistoryModel).filter(ActMissionHistoryModel.mission_id == "MISSION #3804").first()
    if not mission:
        mission = db.query(ActMissionHistoryModel).order_by(ActMissionHistoryModel.id.desc()).first()

    if not mission:
        return ActMissionResponse(
            mission_id="MISSION #3804",
            name="Autonomous Recon Protocol #3804",
            unit="SENTRY-ALPHA",
            stage="VERIFICATION",
            progress=100,
            execution_status="EXECUTING",
            battery_demo_value=88,
            signal_demo_value=94,
            telemetry_summary="Navigational route locked @ Sector 7 line B. Optical feedback synchronized.",
            timestamp="10:51:02 UTC"
        )
    return mission_to_dict(mission)

@router.get("/history", response_model=List[ActMissionResponse])
def get_act_mission_history(db: Session = Depends(get_db)):
    missions = db.query(ActMissionHistoryModel).order_by(ActMissionHistoryModel.id.asc()).all()
    return [mission_to_dict(m) for m in missions]
