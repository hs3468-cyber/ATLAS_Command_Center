from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, Index
from datetime import datetime, timezone
from app.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(50), nullable=False, default="USER") # ADMIN, USER
    name = Column(String(100), nullable=False, default="Authorized User")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_users_username", "username"),
        Index("idx_users_role", "role"),
    )

class DroneConfigModel(Base):
    __tablename__ = "drone_config"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emergency_alert = Column(Boolean, default=True)
    unknown_intruder = Column(Boolean, default=True)
    theft_detection = Column(Boolean, default=True)
    health_emergency = Column(Boolean, default=False)
    operational_status = Column(String(100), default="SIMULATED // READY")
    battery_status = Column(Integer, default=92)
    last_activation = Column(String(100), default="10:51:02 UTC")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class EventModel(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_id = Column(String(100), unique=True, index=True, nullable=False)
    timestamp = Column(String(50), index=True, nullable=False)
    source = Column(String(50), index=True, nullable=False) # VISION, SENSE, CORE, ACT
    event_type = Column(String(100), index=True, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), nullable=False) # ACTIVE, COMPLETED, PENDING, ERROR
    data_json = Column(Text, nullable=True, default="{}")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_events_timestamp", "timestamp"),
        Index("idx_events_source", "source"),
        Index("idx_events_type", "event_type"),
    )

class CoreDecisionModel(Base):
    __tablename__ = "core_decisions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    decision_id = Column(String(100), unique=True, index=True, nullable=False)
    timestamp = Column(String(50), index=True, nullable=False)
    input_event_ids = Column(Text, nullable=False)
    context_summary = Column(Text, nullable=False)
    assessment = Column(String(200), nullable=False)
    decision = Column(String(200), nullable=False)
    approved_action = Column(String(200), nullable=False)
    current_state = Column(String(50), nullable=False)
    confidence = Column(Float, default=0.984)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_decisions_id", "decision_id"),
        Index("idx_decisions_timestamp", "timestamp"),
        Index("idx_decisions_state", "current_state"),
    )

class VisionDetectionModel(Base):
    __tablename__ = "vision_detections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    subject_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. ATLAS-P001
    status = Column(String(50), nullable=False, default="TRACKING")
    observation_count = Column(Integer, default=1)
    first_observed = Column(String(50), nullable=False)
    last_observed = Column(String(50), nullable=False)
    confidence = Column(Float, default=0.994)
    sector = Column(String(100), nullable=False, default="Sector 7")
    hazard_rating = Column(String(50), nullable=False, default="LOW")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_vision_subject_id", "subject_id"),
        Index("idx_vision_status", "status"),
    )

class SensorNodeModel(Base):
    __tablename__ = "sensor_nodes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    node_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. SENSE-NODE-01
    name = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="ONLINE") # ONLINE, WARNING, OFFLINE
    health = Column(String(50), nullable=False, default="NOMINAL")
    motion = Column(String(50), nullable=False, default="CLEAR") # DETECTED, CLEAR
    distance_m = Column(Float, default=2.4)
    temp_c = Column(Float, default=24.5)
    environmental_reading = Column(String(100), default="NOMINAL // 45% HUMIDITY")
    floor_load_kg = Column(Float, default=0.0)
    battery_level = Column(Integer, default=98)
    last_updated = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_sensor_node_id", "node_id"),
        Index("idx_sensor_status", "status"),
    )

class ActMissionHistoryModel(Base):
    __tablename__ = "act_mission_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mission_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. MISSION #3804
    name = Column(String(150), nullable=False)
    unit = Column(String(100), nullable=False) # e.g. Sentry-Alpha
    stage = Column(String(100), nullable=False, default="VERIFICATION") # APPROVED, DISPATCHED, EN ROUTE, VERIFICATION, COMPLETE
    progress = Column(Integer, default=100)
    execution_status = Column(String(50), nullable=False, default="EXECUTING")
    battery_demo_value = Column(Integer, default=88)
    signal_demo_value = Column(Integer, default=94)
    telemetry_summary = Column(Text, nullable=False)
    timestamp = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_act_mission_id", "mission_id"),
        Index("idx_act_stage", "stage"),
    )
