from fastapi import APIRouter
from app.schemas import SystemStatusResponse
from app.websocket_manager import ws_manager

router = APIRouter(prefix="/api", tags=["System"])

# In-memory System State
system_state = {
    "overall_status": "ONLINE",
    "vision_status": "ONLINE",
    "sense_status": "ONLINE",
    "core_status": "ONLINE",
    "act_status": "READY",
    "current_state": "MONITORING",
    "last_event_timestamp": None
}

def update_system_state_from_event(source: str, status: str, timestamp: str):
    system_state["last_event_timestamp"] = timestamp
    source_upper = source.upper()

    if source_upper == "VISION":
        system_state["vision_status"] = "ACTIVE" if status == "ACTIVE" else "ONLINE"
    elif source_upper == "SENSE":
        system_state["sense_status"] = "ACTIVE" if status == "ACTIVE" else "ONLINE"
    elif source_upper == "CORE":
        system_state["core_status"] = "EVALUATING" if status == "ACTIVE" else "ONLINE"
    elif source_upper == "ACT":
        system_state["act_status"] = "EXECUTING" if status == "ACTIVE" else "READY"

@router.get("/health")
def get_health():
    return {
        "status": "ok",
        "service": "ATLAS Command Center Backend"
    }

@router.get("/system/status", response_model=SystemStatusResponse)
def get_system_status():
    return SystemStatusResponse(
        overall_status=system_state["overall_status"],
        vision_status=system_state["vision_status"],
        sense_status=system_state["sense_status"],
        core_status=system_state["core_status"],
        act_status=system_state["act_status"],
        backend_mode="RULE_BASED_DEMO",
        database_status="CONNECTED",
        websocket_active_connections=len(ws_manager.active_connections),
        last_event_timestamp=system_state["last_event_timestamp"]
    )
