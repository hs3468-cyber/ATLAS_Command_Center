"""
ATLAS Command Center — Privacy & Consent Router
Provides GET /api/privacy/policy endpoint returning transparent data governance settings.
Accessible to both ADMIN and USER roles.
"""

from fastapi import APIRouter
from app.schemas import PrivacyPolicyResponse

router = APIRouter(prefix="/api/privacy", tags=["Privacy & Consent Center"])


@router.get(
    "/policy",
    response_model=PrivacyPolicyResponse
)
def get_privacy_policy():
    """
    Returns configured privacy policies, data collection matrix, and retention policies.
    """
    return PrivacyPolicyResponse(
        monitoring_purpose="Women's Safety & Authorized Emergency Monitoring",
        collected_data=[
            "Safety Alerts & Sensor Triggers",
            "Environmental Telemetry (ESP32 Motion/Load)",
            "Optical Detection Metadata (Subject Tracking Tags)",
            "System Action Audit Logs (Actor, Timestamp, Action)"
        ],
        excluded_data=[
            "Raw Biometric Storage (No face photographs or feature vectors stored)",
            "Unnecessary Personal Data",
            "Raw Video/Camera Frames (Processed in-memory only)",
            "Passwords, Tokens, or Private Auth Credentials"
        ],
        retention_policy="30 Days (Automated Log Purge Schedule)",
        privacy_mode="ACTIVE",
        authorized_access="ADMIN / AUTHORIZED USERS",
        disclaimer=(
            "Software Prototype Notice: ATLAS Privacy & Audit mechanisms provide transparent data governance, "
            "traceability, and role accountability within the Command Center application. They do not constitute "
            "formal legal compliance certification or guarantee preventing out-of-band administrator misuse."
        )
    )
