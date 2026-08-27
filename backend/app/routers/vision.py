from typing import List, Optional
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VisionDetectionModel, UserModel
from app.schemas import VisionStatusResponse, VisionDetectionResponse
from app.routers.auth import require_admin


router = APIRouter(
    prefix="/api/vision",
    tags=["Vision Intelligence"]
)


# ---------------------------------------------------------
# Vision device state
# ---------------------------------------------------------
# The user controls this state from the dashboard.
# True  = Camera ON
# False = Camera OFF
vision_enabled = True


class VisionStatusUpdate(BaseModel):
    enabled: Optional[bool] = None


def detection_to_dict(model: VisionDetectionModel) -> dict:
    return {
        "subject_id": model.subject_id,
        "status": model.status,
        "observation_count": model.observation_count,
        "first_observed": model.first_observed,
        "last_observed": model.last_observed,
        "confidence": model.confidence,
        "sector": model.sector,
        "hazard_rating": model.hazard_rating
    }


# ---------------------------------------------------------
# GET Vision Status
# ---------------------------------------------------------
@router.get(
    "/status",
    response_model=VisionStatusResponse
)
def get_vision_status(
    db: Session = Depends(get_db)
):
    count = db.query(VisionDetectionModel).count()

    last_evt = (
        db.query(VisionDetectionModel)
        .order_by(VisionDetectionModel.id.desc())
        .first()
    )

    last_ts = last_evt.last_observed if last_evt else None

    if vision_enabled:
        current_status = "ACTIVE"
        current_feed_status = "LIVE // 1080P 60FPS"
    else:
        current_status = "OFF"
        current_feed_status = "OFFLINE"

    return VisionStatusResponse(
        status=current_status,
        active_subjects_count=count if vision_enabled and count > 0 else 0,
        feed_status=current_feed_status,
        last_detection_timestamp=last_ts
    )


# ---------------------------------------------------------
# PUT Vision ON / OFF (ADMIN ONLY)
# ---------------------------------------------------------
@router.put("/status")
def update_vision_status(
    enabled: Optional[bool] = None,
    body: Optional[VisionStatusUpdate] = None,
    admin: UserModel = Depends(require_admin),
    db: Session = Depends(get_db)
):
    global vision_enabled

    if enabled is not None:
        vision_enabled = enabled
    elif body and body.enabled is not None:
        vision_enabled = body.enabled
    else:
        vision_enabled = not vision_enabled

    # Log camera power state change to Audit Trail
    try:
        from app.services.audit_service import log_audit_entry
        log_audit_entry(
            db=db,
            actor_username=admin.username,
            actor_role=admin.role,
            action="CAMERA_CHANGE",
            resource="VISION",
            status="SUCCESS",
            details={"new_state": "ACTIVE" if vision_enabled else "OFF"}
        )
    except Exception:
        pass

    return {
        "success": True,
        "status": "ACTIVE" if vision_enabled else "OFF",
        "feed_status": (
            "LIVE // 1080P 60FPS"
            if vision_enabled
            else "OFFLINE"
        ),
        "message": (
            "Vision system turned ON by user."
            if vision_enabled
            else "Vision system turned OFF by user."
        )
    }


# ---------------------------------------------------------
# Get Vision Detections
# ---------------------------------------------------------
@router.get(
    "/detections",
    response_model=List[VisionDetectionResponse]
)
def get_vision_detections(
    db: Session = Depends(get_db)
):
    detections = (
        db.query(VisionDetectionModel)
        .order_by(VisionDetectionModel.id.asc())
        .all()
    )

    return [
        detection_to_dict(d)
        for d in detections
    ]


# ---------------------------------------------------------
# Get Single Vision Detection
# ---------------------------------------------------------
@router.get(
    "/detections/{subject_id}",
    response_model=VisionDetectionResponse
)
def get_vision_detection_by_id(
    subject_id: str,
    db: Session = Depends(get_db)
):
    detection = (
        db.query(VisionDetectionModel)
        .filter(
            VisionDetectionModel.subject_id == subject_id
        )
        .first()
    )

    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Detection subject '{subject_id}' not found"
        )

    return detection_to_dict(detection)