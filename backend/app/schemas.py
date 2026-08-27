from pydantic import BaseModel, Field
from typing import Literal, Dict, Any, Optional, List

# Auth & User Management Schemas
class UserLoginRequest(BaseModel):
    username: str = Field(..., description="User login username")
    password: str = Field(..., description="User login password")

class UserResponse(BaseModel):
    id: int
    username: str
    role: str = Field(..., description="Role: ADMIN or USER")
    name: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserCreateRequest(BaseModel):
    username: str = Field(..., description="New username")
    password: str = Field(..., description="New password")
    role: Literal['ADMIN', 'USER'] = Field('USER', description="Assigned role")
    name: str = Field(..., description="Full display name")

# Drone Activation Setup Schemas
class DroneConfigSchema(BaseModel):
    emergency_alert: bool = Field(True, description="Trigger drone on emergency alert")
    unknown_intruder: bool = Field(True, description="Trigger drone on unknown intruder")
    theft_detection: bool = Field(True, description="Trigger drone on theft activity")
    health_emergency: bool = Field(False, description="Trigger drone on health emergency")
    operational_status: str = Field("SIMULATED // READY", description="Drone status label")
    battery_status: int = Field(92, description="Battery percentage")
    last_activation: str = Field("10:51:02 UTC", description="Last activation timestamp")

    class Config:
        from_attributes = True

class DroneConfigUpdateRequest(BaseModel):
    emergency_alert: Optional[bool] = None
    unknown_intruder: Optional[bool] = None
    theft_detection: Optional[bool] = None
    health_emergency: Optional[bool] = None

# Databot Help Assistant Schemas
class DatabotChatRequest(BaseModel):
    message: str = Field(..., description="User question or prompt for Databot")
    history: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="Recent conversation history turns")

class DatabotChatResponse(BaseModel):
    reply: str = Field(..., description="Databot helpful answer")
    timestamp: str
    suggested_topics: List[str] = Field(default_factory=list)

# Existing Event Schemas
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

# Audit Trail Pydantic Schemas
class AuditLogResponse(BaseModel):
    id: int
    audit_id: str
    timestamp: str
    actor_username: str
    actor_role: str
    action: str
    resource: str
    status: str
    details: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        from_attributes = True

# Privacy & Consent Pydantic Schemas
class PrivacyPolicyResponse(BaseModel):
    monitoring_purpose: str
    collected_data: List[str]
    excluded_data: List[str]
    retention_policy: str
    privacy_mode: str
    authorized_access: str
    disclaimer: str

