import asyncio
import json
import os
import sys
import urllib.request
import urllib.error
import websockets
from app.database import engine, Base, SessionLocal
from app.models import EventModel
from app.main import seed_sample_data

def test_database():
    print("Testing SQLite Database Initialization...")
    Base.metadata.create_all(bind=engine)
    seed_sample_data()
    db = SessionLocal()
    count = db.query(EventModel).count()
    db.close()
    print(f"✓ SQLite Database Initialized OK. Total Events in DB: {count}")
    assert count >= 5, "Database seeding failed"

async def test_websocket():
    print("Testing WebSocket /ws/events Endpoint...")
    uri = "ws://127.0.0.1:8000/ws/events"
    try:
        async with websockets.connect(uri) as websocket:
            await websocket.send("PING")
            response = await websocket.receive()
            print(f"✓ WebSocket Response Received: {response}")
    except Exception as e:
        print(f"✗ WebSocket Test Failed: {e}")
        raise e

def test_http_endpoints():
    print("Testing HTTP REST Endpoints...")
    base_url = "http://127.0.0.1:8000"

    # 1. Health
    req = urllib.request.Request(f"{base_url}/api/health")
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print("✓ GET /api/health:", res)
        assert res.get("status") == "ok"

    # 2. System Status
    req = urllib.request.Request(f"{base_url}/api/system/status")
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print("✓ GET /api/system/status:", res)
        assert res.get("overall_status") == "ONLINE"

    # 3. GET Events
    req = urllib.request.Request(f"{base_url}/api/events")
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print(f"✓ GET /api/events: Returned {len(res)} events")
        assert len(res) >= 1

    # 4. POST Valid Event
    valid_payload = json.dumps({
        "id": f"EVT-TEST-{int(asyncio.get_event_loop().time() * 1000)}",
        "timestamp": "2026-08-23T12:00:00Z",
        "source": "VISION",
        "type": "TEST_EVENT",
        "message": "Automated system test event",
        "status": "ACTIVE",
        "data": {"test": True}
    }).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/api/events", data=valid_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print("✓ POST /api/events:", res["id"])

    # 5. POST Invalid Event (Verify 422 Rejection)
    invalid_payload = json.dumps({
        "id": "EVT-INVALID",
        "timestamp": "2026-08-23T12:00:00Z",
        "source": "INVALID_MODULE", # Invalid enum source
        "type": "TEST_EVENT",
        "message": "Should be rejected",
        "status": "ACTIVE"
    }).encode('utf-8')
    try:
        req = urllib.request.Request(f"{base_url}/api/events", data=invalid_payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            print("✗ Error: Invalid payload was unexpectedly accepted!")
    except urllib.error.HTTPError as err:
        print(f"✓ POST /api/events Invalid Source correctly rejected with HTTP {err.code}")
        assert err.code == 422

    # 6. POST Demo Trigger
    req = urllib.request.Request(f"{base_url}/api/events/demo", data=b'', headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print("✓ POST /api/events/demo:", res)
        assert res.get("status") == "completed"

if __name__ == "__main__":
    test_database()
    print("Database test passed!")
