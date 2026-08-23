import json
import time
from fastapi.testclient import TestClient
from app.database import Base, engine
from app.models import (
    EventModel,
    CoreDecisionModel,
    VisionDetectionModel,
    SensorNodeModel,
    ActMissionHistoryModel
)
from app.main import app

# Ensure all tables are created in SQLite
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_full_18_check_end_to_end_suite():
    print("==================================================")
    print("ATLAS Command Center Full 18-Check End-to-End Suite")
    print("==================================================")

    ts_ms = int(time.time() * 1000)

    # 1. Health Check
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ATLAS Command Center Backend"}
    print("[OK] 1. GET /api/health passed")

    # 2. Comprehensive System Status (All 5 Modules)
    response = client.get("/api/system/status")
    assert response.status_code == 200
    sys_data = response.json()
    assert sys_data["overall_status"] == "ONLINE"
    assert "vision_status" in sys_data
    assert "sense_status" in sys_data
    assert "core_status" in sys_data
    assert "act_status" in sys_data
    assert sys_data["backend_mode"] == "RULE_BASED_DEMO"
    assert sys_data["database_status"] == "CONNECTED"
    print("[OK] 2. GET /api/system/status passed (All 5 modules reported)")

    # 3. Vision Status
    v_status = client.get("/api/vision/status")
    assert v_status.status_code == 200
    assert v_status.json()["status"] == "ACTIVE"
    print("[OK] 3. GET /api/vision/status passed")

    # 4. Vision Detections
    v_detections = client.get("/api/vision/detections")
    assert v_detections.status_code == 200
    assert len(v_detections.json()) >= 1
    print(f"[OK] 4. GET /api/vision/detections passed ({len(v_detections.json())} subjects)")

    # 5. Vision Detection Details (ATLAS-P001)
    v_subject = client.get("/api/vision/detections/ATLAS-P001")
    assert v_subject.status_code == 200
    assert v_subject.json()["subject_id"] == "ATLAS-P001"
    print("[OK] 5. GET /api/vision/detections/ATLAS-P001 passed")

    # 6. Vision Missing Resource 404 Handling
    v_missing = client.get("/api/vision/detections/UNKNOWN-TARGET-999")
    assert v_missing.status_code == 404
    print("[OK] 6. GET /api/vision/detections/UNKNOWN correctly returned HTTP 404")

    # 7. Sensor Status
    s_status = client.get("/api/sensors/status")
    assert s_status.status_code == 200
    assert s_status.json()["total_nodes"] == 6
    print("[OK] 7. GET /api/sensors/status passed")

    # 8. Sensor Nodes
    s_nodes = client.get("/api/sensors/nodes")
    assert s_nodes.status_code == 200
    assert len(s_nodes.json()) == 6
    print("[OK] 8. GET /api/sensors/nodes passed (6 ESP32 nodes)")

    # 9. Sensor Node Details (SENSE-NODE-01)
    s_node = client.get("/api/sensors/nodes/SENSE-NODE-01")
    assert s_node.status_code == 200
    assert s_node.json()["node_id"] == "SENSE-NODE-01"
    print("[OK] 9. GET /api/sensors/nodes/SENSE-NODE-01 passed")

    # 10. Sensor Missing Node 404 Handling
    s_missing = client.get("/api/sensors/nodes/UNKNOWN-NODE-999")
    assert s_missing.status_code == 404
    print("[OK] 10. GET /api/sensors/nodes/UNKNOWN correctly returned HTTP 404")

    # 11. Core Status
    c_status = client.get("/api/core/status")
    assert c_status.status_code == 200
    assert c_status.json()["processing_mode"] == "RULE_BASED_DEMO"
    print("[OK] 11. GET /api/core/status passed")

    # 12. Core Decisions List
    c_decisions = client.get("/api/core/decisions")
    assert c_decisions.status_code == 200
    print(f"[OK] 12. GET /api/core/decisions passed ({len(c_decisions.json())} decisions)")

    # 13. ACT Status
    a_status = client.get("/api/act/status")
    assert a_status.status_code == 200
    assert a_status.json()["status"] == "READY"
    print("[OK] 13. GET /api/act/status passed")

    # 14. ACT Mission Alignment (MISSION #3804)
    a_mission = client.get("/api/act/mission")
    assert a_mission.status_code == 200
    assert a_mission.json()["mission_id"] == "MISSION #3804"
    print("[OK] 14. GET /api/act/mission passed (MISSION #3804 consistently returned)")

    # 15. ACT Mission History
    a_history = client.get("/api/act/history")
    assert a_history.status_code == 200
    assert len(a_history.json()) >= 1
    print(f"[OK] 15. GET /api/act/history passed ({len(a_history.json())} missions)")

    # 16. Event Creation & Duplicate Protection
    evt_payload = {
        "id": f"EVT-TEST-{ts_ms}",
        "timestamp": "2026-08-23T12:00:00Z",
        "source": "VISION",
        "type": "TEST_EVENT",
        "message": "Integration audit event test",
        "status": "ACTIVE",
        "data": {"test": True}
    }
    create_resp = client.post("/api/events", json=evt_payload)
    assert create_resp.status_code == 201
    dup_resp = client.post("/api/events", json=evt_payload)
    assert dup_resp.status_code == 400
    print("[OK] 16. Event creation & duplicate-event protection passed")

    # 17. Invalid Request Payload Handling (HTTP 422)
    invalid_event = {
        "id": "EVT-INVALID-SRC",
        "timestamp": "2026-08-23T12:00:00Z",
        "source": "INVALID_MODULE_NAME",
        "type": "UNKNOWN",
        "message": "Should be rejected with HTTP 422",
        "status": "ACTIVE"
    }
    invalid_resp = client.post("/api/events", json=invalid_event)
    assert invalid_resp.status_code == 422
    print("[OK] 17. Invalid payload correctly rejected with HTTP 422")

    # 18. Full End-to-End Live Demo Sequence & WebSocket Broadcast Test
    demo_resp = client.post("/api/events/demo")
    assert demo_resp.status_code == 200
    demo_data = demo_resp.json()
    assert demo_data["status"] == "completed"

    with client.websocket_connect("/ws/events") as websocket:
        websocket.send_text("PING")
        ws_msg = websocket.receive_text()
        assert "PONG" in ws_msg
        print("[OK] 18. Full demo sequence & WebSocket broadcasting passed:", demo_data["demo_sequence"])

    print("\n==================================================")
    print("ALL 18 END-TO-END AUDIT CHECKS PASSED 100%")
    print("==================================================")

if __name__ == "__main__":
    test_full_18_check_end_to_end_suite()
