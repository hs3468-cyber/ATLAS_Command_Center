from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import DroneConfigModel, UserModel
from app.schemas import DroneConfigSchema, DroneConfigUpdateRequest
from app.routers.auth import require_admin, get_current_user

router = APIRouter(prefix="/api/drone", tags=["Drone Activation Setup"])

@router.get("/config", response_model=DroneConfigSchema)
def get_drone_config(
    db: Session = Depends(get_db),
    user: UserModel = Depends(get_current_user)
):
    config = db.query(DroneConfigModel).first()
    if not config:
        config = DroneConfigModel(
            emergency_alert=True,
            unknown_intruder=True,
            theft_detection=True,
            health_emergency=False,
            operational_status="SIMULATED // READY",
            battery_status=92,
            last_activation="10:51:02 UTC"
        )
        db.add(config)
        db.commit()
        db.refresh(config)

    return config

@router.post("/config", response_model=DroneConfigSchema)
def update_drone_config(
    update_in: DroneConfigUpdateRequest,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_admin)
):
    config = db.query(DroneConfigModel).first()
    if not config:
        config = DroneConfigModel()
        db.add(config)

    if update_in.emergency_alert is not None:
        config.emergency_alert = update_in.emergency_alert
    if update_in.unknown_intruder is not None:
        config.unknown_intruder = update_in.unknown_intruder
    if update_in.theft_detection is not None:
        config.theft_detection = update_in.theft_detection
    if update_in.health_emergency is not None:
        config.health_emergency = update_in.health_emergency

    db.commit()
    db.refresh(config)
    return config
