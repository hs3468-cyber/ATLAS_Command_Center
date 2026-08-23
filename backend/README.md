# ATLAS Command Center — Full 5-Module Backend API Layer

A Python FastAPI REST API and WebSocket backend service for the ATLAS Command Center, featuring SQLite database persistence (`SQLAlchemy`), Pydantic schema validation, real-time WebSocket event broadcasting, and dedicated endpoints for all five system modules (**VISION**, **SENSORS**, **CORE**, **ACT**, and **SYSTEM**).

> [!NOTE]
> **Demonstration Implementation Notice:**  
> The current ATLAS Core decision engine is a deterministic rule-based demonstration implementation (`RULE_BASED_DEMO`). It is not a trained machine-learning model, and its confidence values (`98.4%`) are simulated demonstration metrics. All optical detections, sensor readings, and drone missions remain software-only demonstration payloads.

---

## Architecture Overview

```text
               FastAPI Backend (http://127.0.0.1:8000)
┌──────────────────────────────────────────────────────────────────┐
│ REST API Endpoints                                               │
│ ├── /api/system/status  (All 5 Modules Status Report)           │
│ ├── /api/vision/status & /api/vision/detections                  │
│ ├── /api/sensors/status & /api/sensors/nodes                    │
│ ├── /api/core/status & /api/core/decisions                       │
│ ├── /api/act/status & /api/act/mission                           │
│ └── /api/events & /api/events/demo                               │
│                                                                  │
│ WebSocket Stream: /ws/events                                     │
│ SQLite Database: backend/atlas.db                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5-Module API Endpoints Reference

### 1. System Module (`/api/system`)
- `GET /api/health`: Health check (`{"status": "ok"}`).
- `GET /api/system/status`: Reports all 5 module states (**VISION**, **SENSE**, **CORE**, **ACT**, **OVERALL SYSTEM**), `backend_mode` (`RULE_BASED_DEMO`), `database_status` (`CONNECTED`), `websocket_active_connections`, and `last_event_timestamp`.

### 2. Vision Intelligence Module (`/api/vision`)
- `GET /api/vision/status`: Returns Vision system status (`ACTIVE`, 3 tracked subjects, optical feed status).
- `GET /api/vision/detections`: Returns list of simulated detection subjects (`ATLAS-P001`, `ATLAS-P002`, `ATLAS-V003`).
- `GET /api/vision/detections/{subject_id}`: Returns details for a single subject or HTTP 404.

### 3. Sensor Network Module (`/api/sensors`)
- `GET /api/sensors/status`: Returns Sensor Network health (`ONLINE`, 6 total nodes, 5 online, 1 warning).
- `GET /api/sensors/nodes`: Returns 6 mock ESP32 nodes (`SENSE-NODE-01` through `SENSE-NODE-06`).
- `GET /api/sensors/nodes/{node_id}`: Returns single node details or HTTP 404.
- `GET /api/sensors/events`: Returns historical sensor reading events.

### 4. Core Intelligence Module (`/api/core`)
- `GET /api/core/status`: Returns Core status (`ONLINE`, mode `RULE_BASED_DEMO`).
- `GET /api/core/decisions`: Returns recent fused Core decisions.
- `GET /api/core/decisions/{decision_id}`: Returns single decision by string ID.
- `POST /api/core/process`: Submits an event ID for manual Core context evaluation.

### 5. ATLAS Act Module (`/api/act`)
- `GET /api/act/status`: Returns execution status (`READY` / `EXECUTING`).
- `GET /api/act/mission`: Returns active mission status (`MISSION #3804`, assigned unit `Sentry-Alpha`, progress 100%, battery 88%, signal 94%).
- `GET /api/act/history`: Returns historical simulated mission logs from `act_mission_history`.

### 6. Event Management & Pipeline (`/api/events`)
- `GET /api/events`: Returns recent system events (query filters: `limit`, `source`, `event_type`).
- `GET /api/events/{event_id}`: Single event by string ID.
- `POST /api/events`: Validates event payload (HTTP 422 for invalid `source` or `status`), persists in SQLite, triggers Core processing for `VISION`/`SENSE` sources, and broadcasts via WebSocket.
- `POST /api/events/demo`: Asynchronously triggers the complete **VISION → SENSE → CORE CONTEXT → CORE DECISION → ACT** sequence.

---

## Database Tables (`backend/atlas.db`)

1. `events`: Standard event records.
2. `core_decisions`: Fused multi-modal context and decision summaries.
3. `vision_detections`: Simulated optical tracking observations.
4. `sensor_nodes`: ESP32 sensor telemetry & health.
5. `act_mission_history`: Autonomous mission execution logs.

---

## Setup & Testing Commands

```bash
cd backend
python -m pip install -r requirements.txt
python test_app.py
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API Docs available at: **`http://127.0.0.1:8000/docs`**
