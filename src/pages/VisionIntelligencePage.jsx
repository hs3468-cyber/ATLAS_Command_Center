import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { visionEventsData } from '../mock/visionData';
import { Eye, Video, Radio, Shield, RefreshCw, AlertCircle, Play, Crosshair, Monitor } from 'lucide-react';

export const VisionIntelligencePage = () => {
  const { isAdmin } = useAuth();
  const [visionStatus, setVisionStatus] = useState('ACTIVE');
  const [feedStatus, setFeedStatus] = useState('LIVE // 1080P 60FPS');
  const [events, setEvents] = useState([]);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());

  // Ticker for live simulated video timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --------------------------------------------------
  // Load Vision data from FastAPI
  // --------------------------------------------------
  const loadVisionData = async () => {
    try {
      const statusResponse = await apiService.getVisionStatus();

      if (statusResponse.isConnected && statusResponse.data) {
        setVisionStatus(statusResponse.data.status || 'ACTIVE');
        setFeedStatus(
          statusResponse.data.feed_status ||
          'LIVE // 1080P 60FPS'
        );
      }

      const eventsResponse = await apiService.getEventsBySource('VISION', 10);
      if (eventsResponse.isConnected && Array.isArray(eventsResponse.data)) {
        setEvents(eventsResponse.data);
      } else {
        setEvents(visionEventsData || []);
      }

      const detectionsResponse = await apiService.getVisionDetections();
      if (detectionsResponse.isConnected && Array.isArray(detectionsResponse.data)) {
        setDetections(detectionsResponse.data);
      } else {
        setDetections([
          { subject_id: 'ATLAS-P001', status: 'TRACKING', confidence: 0.994, sector: 'Sector 7', hazard_rating: 'LOW' }
        ]);
      }
    } catch (error) {
      console.error('[VISION] Failed to load backend data:', error);
      setEvents(visionEventsData || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisionData();
  }, []);

  // --------------------------------------------------
  // User-controlled ON / OFF
  // --------------------------------------------------
  const toggleVision = async () => {
    if (!isAdmin) return;
    const currentlyOn = visionStatus === 'ACTIVE' || visionStatus === 'ON';
    const newStatus = !currentlyOn;

    setUpdating(true);

    try {
      const response = await apiService.updateVisionStatus(newStatus);

      if (response.isConnected && response.data) {
        setVisionStatus(response.data.status || (newStatus ? 'ACTIVE' : 'OFF'));
        setFeedStatus(response.data.feed_status || (newStatus ? 'LIVE // 1080P 60FPS' : 'OFFLINE'));
        await loadVisionData();
      }
    } catch (error) {
      console.error('[VISION] Toggle failed:', error);
    } finally {
      setUpdating(false);
    }
  };

  const isOn = visionStatus === 'ACTIVE' || visionStatus === 'ON';
  const activeSubject = detections[0] || { subject_id: 'ATLAS-P001', status: 'TRACKING', confidence: 0.994, sector: 'Sector 7' };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1f2937',
        padding: '40px 30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>

        {/* HEADER */}
        <div
          style={{
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 600, color: '#111827' }}>
              VISION INTELLIGENCE
            </h1>
            <p style={{ marginTop: '7px', color: '#6b7280', fontSize: '15px' }}>
              Real-time optical surveillance, subject tracking, and camera controls
            </p>
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>POWER STATE:</span>
              <button
                type="button"
                onClick={toggleVision}
                disabled={updating}
                style={{
                  background: isOn ? '#111827' : '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: updating ? 'not-allowed' : 'pointer',
                  opacity: updating ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {updating ? 'UPDATING...' : isOn ? 'TURN OFF CAMERA' : 'TURN ON CAMERA'}
              </button>
            </div>
          )}
        </div>

        {/* DEDICATED LIVE SURVEILLANCE FEED VIEWPORT */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '30px',
            background: '#ffffff',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* VIEWPORT HEADER BAR */}
          <div
            style={{
              padding: '14px 20px',
              background: '#111827',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Monitor size={18} style={{ color: '#60a5fa' }} />
              <strong style={{ fontSize: '15px', letterSpacing: '0.03em' }}>
                LIVE SURVEILLANCE FEED
              </strong>

              {isOn ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                  🟢 LIVE
                </span>
              ) : (
                <span
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '12px',
                  }}
                >
                  OFFLINE
                </span>
              )}
            </div>

            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>
              SOFTWARE DEMONSTRATION // SIMULATED SURVEILLANCE FEED
            </div>
          </div>

          {/* VIEWPORT SCREEN AREA */}
          <div
            style={{
              width: '100%',
              minHeight: '340px',
              background: isOn ? '#0f172a' : '#1e293b',
              color: '#ffffff',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            {isOn ? (
              <>
                {/* HUD TOP BAR OVERLAYS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, marginRight: '8px' }}>● REC ACTIVE</span>
                    <span>1080P // 60FPS</span>
                  </div>

                  <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#60a5fa' }}>
                    CAM-04 // {activeSubject.sector || 'Sector 7'} // {liveTime}
                  </div>
                </div>

                {/* SIMULATED TARGET TRACKING OVERLAY */}
                <div
                  style={{
                    position: 'absolute',
                    top: '40%',
                    left: '45%',
                    transform: 'translate(-50%, -50%)',
                    border: '2px dashed #22c55e',
                    borderRadius: '8px',
                    padding: '24px 32px',
                    background: 'rgba(34, 197, 94, 0.08)',
                    textAlign: 'center',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <Crosshair size={32} style={{ color: '#22c55e', marginBottom: '6px', opacity: 0.8 }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e', letterSpacing: '0.05em' }}>
                    TARGET TRACKED: {activeSubject.subject_id}
                  </div>
                  <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '2px' }}>
                    CONFIDENCE: {((activeSubject.confidence || 0.994) * 100).toFixed(1)}% // LOW HAZARD
                  </div>
                </div>

                {/* HUD BOTTOM BAR OVERLAYS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2, marginTop: '180px' }}>
                  <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', maxWidth: '380px' }}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700 }}>OBSERVATION STATUS</div>
                    <div style={{ color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
                      Optical surveillance active. Monitoring perimeter sector line.
                    </div>
                  </div>

                  <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', color: '#fca5a5', fontWeight: 700 }}>
                    SIMULATED DEMONSTRATION FEED
                  </div>
                </div>
              </>
            ) : (
              /* CAMERA OFF STATE */
              <div
                style={{
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Video size={48} style={{ color: '#ef4444', opacity: 0.6, marginBottom: '14px' }} />
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#f87171', fontWeight: 700 }}>
                  LIVE FEED UNAVAILABLE — CAMERA OFF
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', maxWidth: '420px', lineHeight: '1.5' }}>
                  The Vision camera has been turned off by the Admin. Turn on the camera to resume live optical surveillance and subject tracking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SURVEILLANCE METRICS & CURRENT REPORT GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          {/* SURVEILLANCE STATUS CARD */}
          <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
            <h2 style={{ margin: '0 0 15px', fontSize: '17px', fontWeight: 600 }}>Surveillance Parameters</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '14px' }}>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>Surveillance Mode</div>
                <strong style={{ color: isOn ? '#16a34a' : '#dc2626' }}>
                  {isOn ? 'Active Surveillance' : 'Inactive'}
                </strong>
              </div>

              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>Recording Status</div>
                <strong style={{ color: isOn ? '#16a34a' : '#6b7280' }}>
                  {isOn ? 'Active Recording' : 'Stopped'}
                </strong>
              </div>

              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>Feed Status</div>
                <strong>{isOn ? feedStatus : 'OFFLINE'}</strong>
              </div>

              <div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>Observation Status</div>
                <strong>{isOn ? 'Monitoring Sector 7' : 'Not Monitoring'}</strong>
              </div>
            </div>
          </div>

          {/* LATEST SYSTEM REPORT CARD */}
          <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '17px', fontWeight: 600 }}>Latest System Report</h2>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
              {isOn
                ? `Vision camera is actively monitoring ${activeSubject.sector || 'Sector 7'}. Subject ${activeSubject.subject_id} tagged with confidence ${((activeSubject.confidence || 0.994) * 100).toFixed(1)}%.`
                : 'The Vision camera is turned off. Optical surveillance and event recording are paused.'}
            </p>
          </div>
        </div>

        {/* RECENT VISION EVENTS */}
        <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
          <h2 style={{ margin: '0 0 15px', fontSize: '18px', fontWeight: 600 }}>Recent Vision Events</h2>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading Vision events...</p>
          ) : events.length > 0 ? (
            events.slice(0, 5).map((event, index) => (
              <div
                key={event.id || index}
                style={{
                  padding: '12px 0',
                  borderBottom: index !== Math.min(events.length, 5) - 1 ? '1px solid #e5e7eb' : 'none',
                }}
              >
                <strong style={{ display: 'block', fontSize: '14px', color: '#374151' }}>
                  {event.type || event.eventType || 'Vision Event'}
                </strong>

                <span style={{ display: 'block', marginTop: '4px', fontSize: '13px', color: '#6b7280' }}>
                  {event.message || event.description || 'Vision observation recorded'}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280' }}>No recent vision events.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default VisionIntelligencePage;