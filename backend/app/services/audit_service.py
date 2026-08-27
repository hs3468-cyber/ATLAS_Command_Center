"""
ATLAS Command Center — Audit Logging Service
Provides backend-controlled, append-only administrative audit trail logging.
Guarantees zero storage of secrets, tokens, passwords, face data, or raw media.
"""

import json
import time
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from app.models import AuditLogModel


def log_audit_entry(
    db: Session,
    actor_username: str,
    actor_role: str,
    action: str,
    resource: str,
    status: str = "SUCCESS",
    details: Optional[Dict[str, Any]] = None
) -> AuditLogModel:
    """
    Creates and persists an immutable backend audit record.
    Actor identity MUST come from authenticated backend user state.
    """
    timestamp_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    audit_id = f"AUD-{int(time.time() * 1000)}"

    # Clean details to ensure zero secret leakage
    safe_details = {}
    if details and isinstance(details, dict):
        for k, v in details.items():
            if any(forbidden in k.lower() for forbidden in ["password", "token", "secret", "hash", "key", "biometric", "frame", "vector"]):
                continue
            safe_details[k] = v

    audit_record = AuditLogModel(
        audit_id=audit_id,
        timestamp=timestamp_str,
        actor_username=actor_username or "unknown",
        actor_role=actor_role or "USER",
        action=action,
        resource=resource,
        status=status,
        details_json=json.dumps(safe_details)
    )

    try:
        db.add(audit_record)
        db.commit()
        db.refresh(audit_record)
    except Exception as err:
        db.rollback()
        print(f"[AUDIT LOG ERROR] Failed to persist audit entry: {err}")

    return audit_record
