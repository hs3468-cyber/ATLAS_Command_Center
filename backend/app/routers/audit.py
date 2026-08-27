"""
ATLAS Command Center — Admin Audit Trail Router
Provides read-only GET /api/audit/logs endpoint for ADMIN users.
USER requests receive HTTP 403 Forbidden.
NO PUT, PATCH, or DELETE routes exist.
"""

import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AuditLogModel, UserModel
from app.schemas import AuditLogResponse
from app.routers.auth import require_admin

router = APIRouter(prefix="/api/audit", tags=["Admin Audit Trail"])


def model_to_audit_dict(model: AuditLogModel) -> dict:
    details = {}
    if model.details_json:
        try:
            details = json.loads(model.details_json)
        except Exception:
            details = {}

    return {
        "id": model.id,
        "audit_id": model.audit_id,
        "timestamp": model.timestamp,
        "actor_username": model.actor_username,
        "actor_role": model.actor_role,
        "action": model.action,
        "resource": model.resource,
        "status": model.status,
        "details": details
    }


@router.get(
    "/logs",
    response_model=List[AuditLogResponse]
)
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    actor: Optional[str] = None,
    action: Optional[str] = None,
    resource: Optional[str] = None,
    admin: UserModel = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Returns administrative audit logs (ADMIN ONLY).
    Rejects USER requests with HTTP 403 Forbidden.
    """
    query = db.query(AuditLogModel)

    if actor:
        query = query.filter(AuditLogModel.actor_username == actor)

    if action:
        query = query.filter(AuditLogModel.action == action)

    if resource:
        query = query.filter(AuditLogModel.resource == resource)

    logs = (
        query
        .order_by(AuditLogModel.id.desc())
        .limit(limit)
        .all()
    )

    return [model_to_audit_dict(log) for log in logs]
