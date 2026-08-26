import json
import time
from fastapi.testclient import TestClient
from app.database import Base, engine
from app.models import (
    EventModel,
    CoreDecisionModel,
    VisionDetectionModel,
    SensorNodeModel,
    ActMissionHistoryModel,
    UserModel,
    DroneConfigModel
)
from app.main import app, seed_sample_data

# Ensure all tables are created in SQLite
Base.metadata.create_all(bind=engine)
seed_sample_data()

client = TestClient(app)

def test_full_atlas_suite():
    print("==================================================")
    print("ATLAS Women Safety & Surveillance Platform Test Suite")
    print("==================================================")

    # 1. Health Check
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    print("[OK] 1. GET /api/health passed")

    # 2. Admin Login
    admin_login = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert admin_login.status_code == 200
    admin_data = admin_login.json()
    admin_token = admin_data["access_token"]
    assert admin_data["user"]["role"] == "ADMIN"
    print("[OK] 2. POST /api/auth/login (ADMIN) passed")

    # 3. User Login
    user_login = client.post("/api/auth/login", json={"username": "user", "password": "user123"})
    assert user_login.status_code == 200
    user_data = user_login.json()
    user_token = user_data["access_token"]
    assert user_data["user"]["role"] == "USER"
    print("[OK] 3. POST /api/auth/login (USER) passed")

    # 4. User List (Admin Authorized)
    users_resp = client.get("/api/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert users_resp.status_code == 200
    assert len(users_resp.json()) >= 2
    print("[OK] 4. GET /api/users (Admin Authorized) passed")

    # 5. User Creation (Admin Authorized)
    ts = int(time.time())
    new_user_resp = client.post(
        "/api/users",
        json={
            "username": f"testuser_{ts}",
            "password": "password123",
            "role": "USER",
            "name": "Test Family User"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert new_user_resp.status_code == 201
    assert new_user_resp.json()["role"] == "USER"
    print("[OK] 5. POST /api/users (Create User) passed")

    # 6. Role Authorization Rejection (User attempting Admin action)
    forbidden_resp = client.post(
        "/api/users",
        json={"username": "hacker", "password": "123", "role": "ADMIN", "name": "Hacker"},
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert forbidden_resp.status_code == 403
    print("[OK] 6. Role Authorization Rejection (403 Forbidden for User) passed")

    # 7. Drone Config Setup (Get & Update)
    drone_get = client.get("/api/drone/config", headers={"Authorization": f"Bearer {admin_token}"})
    assert drone_get.status_code == 200
    assert "emergency_alert" in drone_get.json()

    drone_update = client.post(
        "/api/drone/config",
        json={"emergency_alert": True, "health_emergency": True},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert drone_update.status_code == 200
    assert drone_update.json()["health_emergency"] is True
    print("[OK] 7. Drone Activation Setup API (GET & POST) passed")

    # 8. Databot Help Assistant Chat
    bot_resp = client.post("/api/databot/chat", json={"message": "What is current camera status?"})
    assert bot_resp.status_code == 200
    assert "reply" in bot_resp.json()
    print("[OK] 8. POST /api/databot/chat passed")

    # 9. Camera Status & Toggle
    v_status = client.get("/api/vision/status")
    assert v_status.status_code == 200

    v_put = client.put("/api/vision/status?enabled=true")
    assert v_put.status_code == 200
    assert v_put.json()["status"] == "ACTIVE"
    print("[OK] 9. GET & PUT /api/vision/status passed")

    # 10. Comprehensive System Status
    sys_status = client.get("/api/system/status")
    assert sys_status.status_code == 200
    assert sys_status.json()["overall_status"] == "ONLINE"
    print("[OK] 10. GET /api/system/status passed")

    print("\n==================================================")
    print("ALL ATLAS WOMEN SAFETY & SURVEILLANCE TESTS PASSED 100%")
    print("==================================================")

if __name__ == "__main__":
    test_full_atlas_suite()
