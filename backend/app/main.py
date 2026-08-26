import json
import logging
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app.models import (
    EventModel,
    CoreDecisionModel,
    VisionDetectionModel,
    SensorNodeModel,
    ActMissionHistoryModel,
    UserModel,
    DroneConfigModel
)
from app.routers import system, events, core, vision, sensors, act, auth, users, drone, databot
from app.websocket_manager import ws_manager


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("atlas.main")


def seed_sample_data():
    db = SessionLocal()

    try:
        # Seed Default Users
        if db.query(UserModel).count() == 0:
            logger.info("Initializing SQLite database with default Admin and User accounts...")
            sample_users = [
                UserModel(
                    username="admin",
                    password_hash=auth.hash_password("admin123"),
                    role="ADMIN",
                    name="System Administrator"
                ),
                UserModel(
                    username="user",
                    password_hash=auth.hash_password("user123"),
                    role="USER",
                    name="Family Member (Authorized User)"
                )
            ]
            for u in sample_users:
                db.add(u)
            db.commit()

        # Seed Default Drone Config
        if db.query(DroneConfigModel).count() == 0:
            logger.info("Initializing Drone Activation Setup default configuration...")
            default_drone = DroneConfigModel(
                emergency_alert=True,
                unknown_intruder=True,
                theft_detection=True,
                health_emergency=False,
                operational_status="SIMULATED // READY",
                battery_status=92,
                last_activation="10:51:02 UTC"
            )
            db.add(default_drone)
            db.commit()

        # Seed Baseline Events
        if db.query(EventModel).count() == 0:
            logger.info(
                "Initializing SQLite database with baseline demo event data..."
            )

            sample_events = [
                {
                    "event_id": "EVT-101",
                    "timestamp": "10:50:54 UTC",
                    "source": "VISION",
                    "event_type": "UNKNOWN_PERSON_ENTERED",
                    "message": "Unknown person detected @ Sector 7 perimeter line",
                    "status": "COMPLETED",
                    "data_json": json.dumps({
                        "target": "ATLAS-P001",
                        "confidence": 0.994
                    })
                },
                {
                    "event_id": "EVT-102",
                    "timestamp": "10:50:56 UTC",
                    "source": "SENSE",
                    "event_type": "MOTION_CONFIRMED",
                    "message": "Acoustic and thermal sensors confirmed ground velocity 1.4 m/s",
                    "status": "COMPLETED",
                    "data_json": json.dumps({
                        "node": "SENSE-NODE-01",
                        "load_kg": 72.4
                    })
                },
                {
                    "event_id": "EVT-103",
                    "timestamp": "10:50:58 UTC",
                    "source": "CORE",
                    "event_type": "SAFETY_ASSESSMENT",
                    "message": "Evaluating historical clearance parameters & multi-layered risk model",
                    "status": "COMPLETED",
                    "data_json": json.dumps({
                        "risk_score": 0.12
                    })
                },
                {
                    "event_id": "EVT-104",
                    "timestamp": "10:51:00 UTC",
                    "source": "CORE",
                    "event_type": "DECISION_GENERATED",
                    "message": "Demo confidence score 98.4%. Action recommended: Dispatch Sentry-Alpha",
                    "status": "COMPLETED",
                    "data_json": json.dumps({
                        "decision": "Approved predefined verification mission #3804"
                    })
                },
                {
                    "event_id": "EVT-105",
                    "timestamp": "10:51:02 UTC",
                    "source": "ACT",
                    "event_type": "MISSION_INITIATED",
                    "message": "Navigational route locked and Autonomous Recon Protocol #3804 deployed",
                    "status": "COMPLETED",
                    "data_json": json.dumps({
                        "mission_id": "MISSION #3804",
                        "unit": "SENTRY-ALPHA"
                    })
                }
            ]

            for se in sample_events:
                db.add(EventModel(**se))

            db.commit()

        # Seed Vision Detections
        if db.query(VisionDetectionModel).count() == 0:
            sample_detections = [
                {
                    "subject_id": "ATLAS-P001",
                    "status": "TRACKING",
                    "observation_count": 42,
                    "first_observed": "10:48:12 UTC",
                    "last_observed": "10:50:54 UTC",
                    "confidence": 0.994,
                    "sector": "Sector 7",
                    "hazard_rating": "LOW"
                },
                {
                    "subject_id": "ATLAS-P002",
                    "status": "MONITORING",
                    "observation_count": 18,
                    "first_observed": "10:30:00 UTC",
                    "last_observed": "10:45:22 UTC",
                    "confidence": 0.982,
                    "sector": "Sector 3",
                    "hazard_rating": "CLEAR"
                },
                {
                    "subject_id": "ATLAS-V003",
                    "status": "PASSIVE",
                    "observation_count": 7,
                    "first_observed": "09:15:00 UTC",
                    "last_observed": "10:12:00 UTC",
                    "confidence": 0.975,
                    "sector": "Sector 1",
                    "hazard_rating": "CLEAR"
                }
            ]

            for sd in sample_detections:
                db.add(VisionDetectionModel(**sd))

            db.commit()

        # Seed Sensor Nodes
        if db.query(SensorNodeModel).count() == 0:
            sample_nodes = [
                {
                    "node_id": "SENSE-NODE-01",
                    "name": "Sector 7 Perimeter Node",
                    "status": "ONLINE",
                    "health": "NOMINAL",
                    "motion": "DETECTED",
                    "distance_m": 2.4,
                    "temp_c": 24.5,
                    "environmental_reading": "NOMINAL // 45% HUMIDITY",
                    "floor_load_kg": 72.4,
                    "battery_level": 98,
                    "last_updated": "10:50:56 UTC"
                },
                {
                    "node_id": "SENSE-NODE-02",
                    "name": "Sector 7 Acoustic Array",
                    "status": "ONLINE",
                    "health": "NOMINAL",
                    "motion": "CLEAR",
                    "distance_m": 12.1,
                    "temp_c": 23.8,
                    "environmental_reading": "NOMINAL // 44% HUMIDITY",
                    "floor_load_kg": 0.0,
                    "battery_level": 96,
                    "last_updated": "10:50:50 UTC"
                },
                {
                    "node_id": "SENSE-NODE-03",
                    "name": "Sector 3 Perimeter Line",
                    "status": "ONLINE",
                    "health": "NOMINAL",
                    "motion": "CLEAR",
                    "distance_m": 45.0,
                    "temp_c": 22.1,
                    "environmental_reading": "NOMINAL // 40% HUMIDITY",
                    "floor_load_kg": 0.0,
                    "battery_level": 91,
                    "last_updated": "10:50:45 UTC"
                },
                {
                    "node_id": "SENSE-NODE-04",
                    "name": "Sector 3 Thermal Matrix",
                    "status": "ONLINE",
                    "health": "NOMINAL",
                    "motion": "CLEAR",
                    "distance_m": 8.0,
                    "temp_c": 25.0,
                    "environmental_reading": "NOMINAL // 42% HUMIDITY",
                    "floor_load_kg": 0.0,
                    "battery_level": 89,
                    "last_updated": "10:50:40 UTC"
                },
                {
                    "node_id": "SENSE-NODE-05",
                    "name": "Sector 1 Access Portal",
                    "status": "WARNING",
                    "health": "RECALIBRATING",
                    "motion": "CLEAR",
                    "distance_m": 3.2,
                    "temp_c": 28.2,
                    "environmental_reading": "WARN // 65% HUMIDITY",
                    "floor_load_kg": 0.0,
                    "battery_level": 64,
                    "last_updated": "10:49:10 UTC"
                },
                {
                    "node_id": "SENSE-NODE-06",
                    "name": "Sector 5 Substation Node",
                    "status": "ONLINE",
                    "health": "NOMINAL",
                    "motion": "CLEAR",
                    "distance_m": 15.4,
                    "temp_c": 21.9,
                    "environmental_reading": "NOMINAL // 38% HUMIDITY",
                    "floor_load_kg": 0.0,
                    "battery_level": 95,
                    "last_updated": "10:50:30 UTC"
                }
            ]

            for sn in sample_nodes:
                db.add(SensorNodeModel(**sn))

            db.commit()

        # Seed ACT Mission History
        if db.query(ActMissionHistoryModel).count() == 0:
            sample_missions = [
                {
                    "mission_id": "MISSION #3804",
                    "name": "Autonomous Recon Protocol #3804",
                    "unit": "SENTRY-ALPHA",
                    "stage": "VERIFICATION",
                    "progress": 100,
                    "execution_status": "EXECUTING",
                    "battery_demo_value": 88,
                    "signal_demo_value": 94,
                    "telemetry_summary": "Navigational route locked @ Sector 7 line B. Optical feedback synchronized.",
                    "timestamp": "10:51:02 UTC"
                },
                {
                    "mission_id": "MISSION #3803",
                    "name": "Perimeter Patrol Protocol #3803",
                    "unit": "SENTRY-ALPHA",
                    "stage": "COMPLETE",
                    "progress": 100,
                    "execution_status": "COMPLETED",
                    "battery_demo_value": 95,
                    "signal_demo_value": 98,
                    "telemetry_summary": "Routine patrol completed across Sectors 1, 3, and 7. Zero anomalies.",
                    "timestamp": "09:30:00 UTC"
                }
            ]

            for sm in sample_missions:
                db.add(ActMissionHistoryModel(**sm))

            db.commit()

        logger.info(
            "All 5 ATLAS backend module baseline tables & user accounts initialized successfully."
        )

    except Exception as e:
        logger.error(f"Error seeding baseline data: {e}")

    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_sample_data()

    yield

    logger.info(
        "Shutting down ATLAS Command Center backend service."
    )


app = FastAPI(
    title="ATLAS Command Center Backend — Women Safety & Surveillance Platform",
    description="FastAPI REST API & WebSocket Backend Service for ATLAS Command Center",
    version="2.0.0",
    lifespan=lifespan
)


# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------
# Supports local development and any Render deployment domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://atlas-command-center-1.onrender.com",
        "https://atlas-command-center-backend.onrender.com",
        "https://atlas-command-center-bkww.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.onrender\.com|http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Include Routers
# ---------------------------------------------------------
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(drone.router)
app.include_router(databot.router)
app.include_router(system.router)
app.include_router(events.router)
app.include_router(core.router)
app.include_router(vision.router)
app.include_router(sensors.router)
app.include_router(act.router)


# ---------------------------------------------------------
# WebSocket Endpoint
# ---------------------------------------------------------
@app.websocket("/ws/events")
async def websocket_events_endpoint(
    websocket: WebSocket
):
    await ws_manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            await websocket.send_text(
                json.dumps({
                    "type": "PONG",
                    "message": "Connection active"
                })
            )

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

    except Exception as e:
        logger.warning(
            f"WebSocket connection error: {e}"
        )
        ws_manager.disconnect(websocket)