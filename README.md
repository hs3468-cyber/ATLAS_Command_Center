# ATLAS Command Center — Full Software Demonstration Platform

An end-to-end autonomous physical AI operational platform featuring a futuristic React + Vite Mission Control frontend, a FastAPI REST API & WebSocket event streaming backend, SQLite database persistence, and an event-driven ATLAS Core context fusion & decision pipeline.

> [!NOTE]
> **Demonstration Implementation Notice:**  
> The current ATLAS Core decision engine is a deterministic rule-based demonstration implementation (`RULE_BASED_DEMO`). It is not a trained machine-learning model, and its confidence values (`98.4%`) are simulated demonstration metrics (`DEMO CONFIDENCE`). All optical detections, sensor readings, and drone missions remain software-only demonstration payloads (`SIMULATED TELEMETRY`). No physical drone control, weapon systems, or hardware actuation are included.

---

## Technical Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS (Dark Glassmorphism Design System)
- **Backend**: Python 3.10+, FastAPI, Uvicorn (ASGI Server), WebSockets
- **Database**: SQLite (`backend/atlas.db`), SQLAlchemy 2.0 ORM, Pydantic v2 Schema Validation

---

## Quickstart & Startup Instructions

### 1. Start the FastAPI Backend Server

Open a terminal window and execute:

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- REST API Base URL: **`http://127.0.0.1:8000`**
- Interactive Swagger API Documentation: **`http://127.0.0.1:8000/docs`**
- WebSocket Live Event Stream: **`ws://127.0.0.1:8000/ws/events`**

### 2. Start the React Frontend Development Server

Open a second terminal window in the root project directory and execute:

```bash
npm.cmd run dev
```

- Application Dashboard: **`http://localhost:3000`** (or **`http://localhost:3001`**)

---

## Five System Ecosystem Modules

1. **Mission Control**: Central dashboard showing live operational pipeline, threat assessment, decision fusion panel, autonomous mission execution status, system module cards, and real-time event timeline.
2. **Vision Intelligence (`ATLAS Vision`)**: Processed camera feed HUD overlay, optical detection matrix, anonymous subject tracking (`ATLAS-P001`), and subject observation history.
3. **Sensor Network (`ATLAS Sense`)**: 6 ESP32 environmental and physical sensor nodes (`SENSE-NODE-01` through `SENSE-NODE-06`), distance telemetry, floor load indicators, and environmental readings.
4. **Core Intelligence (`ATLAS Core`)**: Central context fusion engine combining multi-modal inputs into concise operator-facing decision summaries.
5. **ATLAS Act (`ATLAS Act`)**: Software-simulated autonomous drone mission monitor (`MISSION #3804` — Sentry-Alpha), 5-stage progress execution, telemetry grid, and RTH status.

---

## Live Demonstration Sequence

Click **`RUN LIVE ATLAS DEMO`** on Mission Control to trigger the end-to-end live pipeline sequence:

```text
STEP 1: VISION → Person detected (ATLAS-P001) @ Sector 7
STEP 2: SENSE → Motion received @ SENSE-NODE-01 (2.4m, 72.4kg load)
STEP 3: CORE → Context evaluation started
STEP 4: CORE → Decision generated (Approved predefined verification mission #3804)
STEP 5: ACT → Approved mission initiated (Dispatch Sentry-Alpha)
```

---

## Verification & Build Commands

```bash
# Run Backend Test Suite (18 End-to-End Audit Checks)
python backend/test_app.py

# Run Frontend Production Build
npm.cmd run build
```
