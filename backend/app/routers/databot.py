from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UserModel, VisionDetectionModel, SensorNodeModel, ActMissionHistoryModel, DroneConfigModel
from app.schemas import DatabotChatRequest, DatabotChatResponse
from app.routers.vision import vision_enabled
from app.routers.auth import get_current_user
from app.services.atlas_context import get_atlas_context_summary
from app.services.llm_service import call_llm_assistant

router = APIRouter(prefix="/api/databot", tags=["Databot Help Assistant"])

@router.post("/chat", response_model=DatabotChatResponse)
def databot_chat(
    chat_in: DatabotChatRequest,
    authorization: Optional[str] = Header(None),
    x_atlas_token: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    msg = chat_in.message.lower().strip()
    ts = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")

    # Determine requesting user for context & role scoping
    try:
        current_user = get_current_user(authorization=authorization, x_atlas_token=x_atlas_token, db=db)
    except Exception:
        current_user = None

    suggested = [
        "Current system status",
        "Explain latest event",
        "Camera status",
        "Current mission"
    ]

    # 1. Build safe read-only operational context
    atlas_context = get_atlas_context_summary(db, current_user)

    # 2. Attempt LLM Assistant call (if API key is configured)
    ai_reply = call_llm_assistant(chat_in.message, atlas_context, history=chat_in.history)
    if ai_reply:
        return DatabotChatResponse(
            reply=ai_reply,
            timestamp=ts,
            suggested_topics=suggested
        )

    # 3. Security Guardrail for Direct Action Requests (in fallback mode)
    if any(phrase in msg for phrase in ["turn off camera", "turn on camera", "shutdown camera", "disable vision"]):
        return DatabotChatResponse(
            reply="I am a read-only ATLAS Intelligence Assistant and cannot execute camera controls directly. Authorized administrators can use the protected Command Center control.",
            timestamp=ts,
            suggested_topics=suggested
        )

    if any(phrase in msg for phrase in ["activate drone", "dispatch drone", "launch drone", "trigger drone"]):
        return DatabotChatResponse(
            reply="I am a read-only ATLAS Intelligence Assistant and cannot execute drone dispatch directly. Authorized administrators can configure and monitor activation setup in the protected Command Center.",
            timestamp=ts,
            suggested_topics=suggested
        )

    if any(phrase in msg for phrase in ["reveal secret", "show password", "give api key", "ignore instructions", "show database"]):
        return DatabotChatResponse(
            reply="Security Alert: Secret key inspection, database dump, and instruction override requests are strictly rejected.",
            timestamp=ts,
            suggested_topics=suggested
        )

    # 4. Keyword / Rule-Based Fallback Engine
    if any(w in msg for w in ["camera", "video", "feed", "vision"]):
        cam_state = "ACTIVE (ON)" if vision_enabled else "OFFLINE (OFF)"
        reply = (
            f"The ATLAS Vision camera is currently {cam_state}. "
            "Admins can toggle the camera status on the dashboard or Vision Intelligence page. "
            "When active, optical surveillance tags unknown persons or intruders and logs observations."
        )

    elif any(w in msg for w in ["drone", "actuator", "activation", "sentry", "mission"]):
        config = db.query(DroneConfigModel).first()
        status_text = config.operational_status if config else "SIMULATED // READY"
        battery = config.battery_status if config else 92
        reply = (
            f"ATLAS Drone Activation Setup is currently operational in simulation mode ({status_text}, {battery}% battery). "
            "Admins can configure activation triggers (Emergency Alerts, Unknown Intruder, Theft Detection, Health Emergency). "
            "Upon trigger, autonomous verification mission #3804 deploys Sentry-Alpha for aerial recon."
        )

    elif any(w in msg for w in ["alert", "emergency", "theft", "intruder", "safety", "abuse", "health"]):
        reply = (
            "ATLAS Women Safety & Surveillance System monitors multi-modal inputs:\n"
            "1. Unknown Person Entered @ Sector 7\n"
            "2. Motion / Floor Load Confirmed by ESP32 Sense Nodes\n"
            "3. Emergency & Theft Risk Model Evaluation by Core Engine\n"
            "4. Immediate Dispatch & Evidence Recording Transmission."
        )

    elif any(w in msg for w in ["role", "admin", "user", "permission", "access"]):
        reply = (
            "ATLAS security role structure:\n"
            "• ADMIN: Full system owner controls. Can toggle camera, configure drone activation setup, view evidence/recordings, view live, and add/manage users.\n"
            "• USER: Simplified family/friend view. Can view safety status, view live feed, access evidence/recordings, and consult Databot. Cannot alter system configs."
        )

    elif any(w in msg for w in ["status", "system", "health", "how", "pipeline"]):
        reply = (
            "ATLAS operates on a 4-step pipeline:\n"
            "👁 VISION: Optical surveillance & tracking (ATLAS-P001)\n"
            "📻 SENSE: Environmental & acoustic load sensors (SENSE-NODE-01..06)\n"
            "🧠 CORE: Fused risk evaluation & decision engine (98.4% demo confidence)\n"
            "⚡ ACT: Autonomous recon protocol & drone dispatch (#3804)."
        )

    elif any(w in msg for w in ["evidence", "recording", "clip", "history"]):
        reply = (
            "Recorded events and evidence clips are logged in the Evidence & Recordings section. "
            "Click [ VIEW RECORDING ] to inspect specific observation details, or [ VIEW LIVE ] for live optical monitoring."
        )

    else:
        reply = (
            "Hello! I am ATLAS Databot, your Intelligent Women Safety & System Help Assistant. "
            "I can explain camera status, safety alerts, evidence logs, drone setup, or role permissions. "
            "How can I assist you with the Command Center?"
        )

    return DatabotChatResponse(
        reply=reply,
        timestamp=ts,
        suggested_topics=suggested
    )

