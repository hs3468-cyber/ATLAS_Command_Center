from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VisionDetectionModel, SensorNodeModel, ActMissionHistoryModel, DroneConfigModel
from app.schemas import DatabotChatRequest, DatabotChatResponse
from app.routers.vision import vision_enabled

router = APIRouter(prefix="/api/databot", tags=["Databot Help Assistant"])

@router.post("/chat", response_model=DatabotChatResponse)
def databot_chat(
    chat_in: DatabotChatRequest,
    db: Session = Depends(get_db)
):
    msg = chat_in.message.lower().strip()
    ts = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")

    suggested = [
        "What is current camera status?",
        "Explain women safety alerts",
        "How does drone activation setup work?",
        "What can Admin vs User roles do?"
    ]

    # Keyword intent matching
    if any(w in msg for w in ["camera", "video", "feed", "vision", "turn on", "turn off"]):
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
            "ATLAS Women Safety & Surveillance System monitors multi-modal inputs: "
            "1. Unknown Person Entered @ Sector 7\n"
            "2. Motion / Floor Load Confirmed by ESP32 Sense Nodes\n"
            "3. Emergency & Theft Risk Model Evaluation by Core Engine\n"
            "4. Immediate Dispatch & Evidence Recording Transmission.\n"
            "All events are logged in the View Status & Evidence history."
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
