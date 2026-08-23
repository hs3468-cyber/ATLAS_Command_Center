from pydantic import BaseModel, Field
from typing import Literal, Dict, Any, Optional, List

class AtlasEventCreate(BaseModel):
    id: str = Field(..., description="Unique event identifier (e.g. EVT-101)")
    timestamp: str = Field(..., description="ISO timestamp string")
    source: Literal['VISION', 'SENSE', 'CORE', 'ACT'] = Field(..., description="Event source module")
    type: str = Field(..., description="Event classification type")
    message: str = Field(..., description="Human-readable event summary message")
    status: Literal['ACTIVE', 'COMPLETED', 'PENDING', 'ERROR'] = Field('ACTIVE', description="Execution status")
    data: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary event payload data")

class AtlasEventResponse(BaseModel):
    id: str
    timestamp: str
    source: str
    type: str
    message: str
    status: str
    data: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        from_attributes = True

class SystemStatusResponse(BaseModel):
    overall_status: str = Field("ONLINE", description="Overall platform status")
    vision_status: str = Field("ONLINE", description="ATLAS Vision module status")
    sense_status: str = Field("ONLINE", description="ATLAS Sense module status")
    core_status: str = Field("ONLINE", description="ATLAS Core module status")
    act_status: str = Field("READY", description="ATLAS Act module status")
    backend_mode: str = Field("RULE_BASED_DEMO", description="Backend processing mode")
    database_status: str = Field("CONNECTED", description="SQLite database connectivity")
    websocket_active_connections: int = Field(0, description="Active WebSocket clients")
    last_event_timestamp: Optional[str] = None

# Core Intelligence Pydantic Schemas
class CoreStatusResponse(BaseModel):
    status: str = Field("ONLINE", description="Core operational status")
    state: Literal['MONITORING', 'INVESTIGATING', 'RESPONDING', 'STANDBY'] = Field("MONITORING", description="Operator-facing system state")
    processing_mode: str = Field("RULE_BASED_DEMO", description="Decision engine classification")
    decisions_count: int = Field(0, description="Total decisions generated")
    last_decision_timestamp: Optional[str] = None

class CoreDecisionResponse(BaseModel):
    id: str
    decision_id: str
    timestamp: str
    input_event_ids: List[str] = Field(default_factory=list)
    context_summary: str
    assessment: str
    decision: str
    approved_action: str
    current_state: str
    confidence: float = 0.984

    class Config:
        from_attributes = True

class CoreProcessRequest(BaseModel):
    event_id: str = Field(..., description="Target event ID to process")

# Vision Intelligence Pydantic Schemas
class VisionStatusResponse(BaseModel):
    status: str = Field("ACTIVE", description="Vision pipeline status")
    active_subjects_count: int = Field(3, description="Number of currently tracked subjects")
    feed_status: str = Field("LIVE // 1080P 60FPS", description="Optical feed status")
    last_detection_timestamp: Optional[str] = None

class VisionDetectionResponse(BaseModel):
    subject_id: str = Field(..., description="Anonymous subject identifier (e.g. ATLAS-P001)")
    status: str = Field("TRACKING", description="Tracking status")
    observation_count: int = Field(1, description="Total observation triggers")
    first_observed: str
    last_observed: str
    confidence: float = Field(0.994, description="Simulated confidence score")
    sector: str = Field("Sector 7", description="Sector designation")
    hazard_rating: str = Field("LOW", description="Assessed hazard rating")

    class Config:
        from_attributes = True

# Sensor Network Pydantic Schemas
class SensorStatusResponse(BaseModel):
    status: str = Field("ONLINE", description="Sensor network status")
    total_nodes: int = Field(6, description="Total deployed ESP32 sensor nodes")
    online_nodes: int = Field(5, description="Number of online nodes")
    warning_nodes: int = Field(1, description="Number of nodes requiring attention")
    overall_health: str = Field("98.2% NOMINAL", description="Network health summary")

class SensorNodeResponse(BaseModel):
    node_id: str = Field(..., description="Node ID (e.g. SENSE-NODE-01)")
    name: str
    status: str = Field("ONLINE", description="Connection status (ONLINE, WARNING, OFFLINE)")
    health: str = Field("NOMINAL", description="Device health")
    motion: str = Field("CLEAR", description="Motion presence status")
    distance_m: float = Field(2.4, description="Distance reading in meters")
    temp_c: float = Field(24.5, description="Temperature in Celsius")
    environmental_reading: str = Field("NOMINAL // 45% HUMIDITY", description="Environmental summary")
    floor_load_kg: float = Field(0.0, description="Floor load in kilograms")
    battery_level: int = Field(98, description="Battery percentage")
    last_updated: str

    class Config:
        from_attributes = True

# ATLAS Act Pydantic Schemas
class ActStatusResponse(BaseModel):
    status: str = Field("READY", description="Act execution status")
    current_mission_id: Optional[str] = Field("MISSION #3804", description="Current active mission ID")
    unit_status: str = Field("SENTRY-ALPHA // STANDBY", description="Assigned unit status")

class ActMissionResponse(BaseModel):
    mission_id: str = Field(..., description="Mission ID string")
    name: str = Field(..., description="Mission title")
    unit: str = Field(..., description="Assigned drone/actuator unit")
    stage: str = Field("VERIFICATION", description="Mission stage")
    progress: int = Field(100, description="Execution progress percentage")
    execution_status: str = Field("EXECUTING", description="Execution status")
    battery_demo_value: int = Field(88, description="Simulated drone battery percentage")
    signal_demo_value: int = Field(94, description="Simulated signal strength percentage")
    telemetry_summary: str = Field(..., description="Simulated telemetry summary")
    timestamp: str

    class Config:
        from_attributes = True
