from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VisionDetectionModel
from app.schemas import VisionStatusResponse, VisionDetectionResponse

router = APIRouter(prefix="/api/vision", tags=["Vision Intelligence"])

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

@router.get("/status", response_model=VisionStatusResponse)
def get_vision_status(db: Session = Depends(get_db)):
    count = db.query(VisionDetectionModel).count()
    last_evt = db.query(VisionDetectionModel).order_by(VisionDetectionModel.id.desc()).first()
    last_ts = last_evt.last_observed if last_evt else None

    return VisionStatusResponse(
        status="ACTIVE",
        active_subjects_count=count if count > 0 else 3,
        feed_status="LIVE // 1080P 60FPS",
        last_detection_timestamp=last_ts
    )

@router.get("/detections", response_model=List[VisionDetectionResponse])
def get_vision_detections(db: Session = Depends(get_db)):
    detections = db.query(VisionDetectionModel).order_by(VisionDetectionModel.id.asc()).all()
    return [detection_to_dict(d) for d in detections]

@router.get("/detections/{subject_id}", response_model=VisionDetectionResponse)
def get_vision_detection_by_id(subject_id: str, db: Session = Depends(get_db)):
    detection = db.query(VisionDetectionModel).filter(VisionDetectionModel.subject_id == subject_id).first()
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Detection subject '{subject_id}' not found"
        )
    return detection_to_dict(detection)
