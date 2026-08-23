from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CoreDecisionModel, EventModel
from app.schemas import CoreDecisionResponse, CoreStatusResponse, CoreProcessRequest
from app.core.processor import AtlasCoreProcessor
from app.routers.system import system_state

router = APIRouter(prefix="/api/core", tags=["Core Intelligence"])

def decision_model_to_dict(model: CoreDecisionModel) -> dict:
    input_ids = model.input_event_ids.split(",") if model.input_event_ids else []
    return {
        "id": model.decision_id,
        "decision_id": model.decision_id,
        "timestamp": model.timestamp,
        "input_event_ids": input_ids,
        "context_summary": model.context_summary,
        "assessment": model.assessment,
        "decision": model.decision,
        "approved_action": model.approved_action,
        "current_state": model.current_state,
        "confidence": model.confidence
    }

@router.get("/status", response_model=CoreStatusResponse)
def get_core_status(db: Session = Depends(get_db)):
    count = db.query(CoreDecisionModel).count()
    last_dec = db.query(CoreDecisionModel).order_by(CoreDecisionModel.id.desc()).first()
    last_ts = last_dec.timestamp if last_dec else None

    return CoreStatusResponse(
        status="ONLINE",
        state=system_state.get("current_state", "MONITORING"),
        processing_mode="RULE_BASED_DEMO",
        decisions_count=count,
        last_decision_timestamp=last_ts
    )

@router.get("/decisions", response_model=List[CoreDecisionResponse])
def get_core_decisions(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    decisions = db.query(CoreDecisionModel).order_by(CoreDecisionModel.id.desc()).limit(limit).all()
    return [decision_model_to_dict(dec) for dec in decisions]

@router.get("/decisions/{decision_id}", response_model=CoreDecisionResponse)
def get_core_decision_by_id(decision_id: str, db: Session = Depends(get_db)):
    decision = db.query(CoreDecisionModel).filter(CoreDecisionModel.decision_id == decision_id).first()
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision with id '{decision_id}' not found"
        )
    return decision_model_to_dict(decision)

@router.post("/process")
def process_event_for_core(req: CoreProcessRequest, db: Session = Depends(get_db)):
    event = db.query(EventModel).filter(EventModel.event_id == req.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event '{req.event_id}' not found"
        )

    result = AtlasCoreProcessor.process_event(db, event)
    if not result:
        return {
            "status": "processed",
            "message": "Event evaluated. Context incomplete or duplicate context detected. No new decision generated."
        }
    return result
