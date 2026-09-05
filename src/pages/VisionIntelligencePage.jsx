import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { visionEventsData } from '../mock/visionData';
import {
  Eye,
  Video,
  Radio,
  Shield,
  RefreshCw,
  AlertCircle,
  Play,
  Crosshair,
  Monitor,
  Activity,
  ScanLine,
  Target,
  Layers,
  AlertTriangle
} from 'lucide-react';

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
    <div className="vi-container">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="vi-header-card">
        <div className="vi-title-group">
          <div className="vi-badge-tag">
            <ScanLine size={12} />
            ATLAS // OPTICAL INTELLIGENCE MODULE
          </div>
          <h1 className="vi-main-title">
            <Eye className="vi-title-icon" size={28} />
            VISION INTELLIGENCE
          </h1>
          <p className="vi-subtitle">
            Real-time optical surveillance, subject tracking, and camera controls
          </p>
        </div>

        {isAdmin && (
          <div className="vi-power-controls">
            <span className="vi-power-label">POWER STATE</span>
            <button
              type="button"
              onClick={toggleVision}
              disabled={updating}
              className={`vi-toggle-btn ${isOn ? 'vi-toggle-btn--off' : 'vi-toggle-btn--on'}`}
            >
              {updating ? (
                <RefreshCw size={15} className="spin" />
              ) : (
                <Video size={15} />
              )}
              {updating ? 'UPDATING...' : isOn ? 'TURN OFF CAMERA' : 'TURN ON CAMERA'}
            </button>
          </div>
        )}
      </header>

      {/* ── LIVE SURVEILLANCE FEED VIEWPORT ────────────────────── */}
      <section className="vi-feed-card">

        {/* Viewport header bar */}
        <div className="vi-feed-topbar">
          <div className="vi-feed-topbar-left">
            <Monitor size={16} style={{ color: 'var(--cyan-bright, #00f2fe)' }} />
            <span className="vi-feed-topbar-title">LIVE SURVEILLANCE FEED</span>

            {isOn ? (
              <span className="vi-live-badge">
                <span className="vi-live-dot" />
                LIVE
              </span>
            ) : (
              <span className="vi-offline-badge">OFFLINE</span>
            )}
          </div>
          <div className="vi-feed-topbar-right">
            SOFTWARE DEMONSTRATION // SIMULATED SURVEILLANCE FEED
          </div>
        </div>

        {/* Viewport screen area */}
        <div className={`vi-feed-screen ${isOn ? 'vi-feed-screen--on' : 'vi-feed-screen--off'}`}>
          {isOn ? (
            <>
              {/* HUD top row */}
              <div className="vi-hud-top">
                <div className="vi-hud-chip">
                  <span className="vi-hud-rec">● REC ACTIVE</span>
                  <span>1080P // 60FPS</span>
                </div>
                <div className="vi-hud-chip vi-hud-chip--blue">
                  CAM-04 // {activeSubject.sector || 'Sector 7'} // {liveTime}
                </div>
              </div>

              {/* Simulated target tracking overlay */}
              <div className="vi-target-box">
                <Crosshair size={32} className="vi-target-icon" />
                <div className="vi-target-label">
                  TARGET TRACKED: {activeSubject.subject_id}
                </div>
                <div className="vi-target-conf">
                  CONFIDENCE: {((activeSubject.confidence || 0.994) * 100).toFixed(1)}% // LOW HAZARD
                </div>
              </div>

              {/* HUD bottom row */}
              <div className="vi-hud-bottom">
                <div className="vi-hud-obs">
                  <div className="vi-hud-obs-label">OBSERVATION STATUS</div>
                  <div className="vi-hud-obs-value">
                    Optical surveillance active. Monitoring perimeter sector line.
                  </div>
                </div>
                <div className="vi-hud-demo-tag">
                  SIMULATED DEMONSTRATION FEED
                </div>
              </div>
            </>
          ) : (
            /* Camera OFF state */
            <div className="vi-feed-offline-state">
              <Video size={52} className="vi-feed-offline-icon" />
              <h3 className="vi-feed-offline-title">LIVE FEED UNAVAILABLE — CAMERA OFF</h3>
              <p className="vi-feed-offline-msg">
                The Vision camera has been turned off by the Admin. Turn on the camera to resume live optical surveillance and subject tracking.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── METRICS + REPORT GRID ──────────────────────────────── */}
      <div className="vi-info-grid">

        {/* Surveillance Parameters */}
        <section className="vi-info-card">
          <div className="vi-info-card-header">
            <h2 className="vi-info-card-title">
              <Radio size={16} />
              Surveillance Parameters
            </h2>
          </div>
          <div className="vi-params-grid">
            <div className="vi-param-item">
              <span className="vi-param-label">Surveillance Mode</span>
              <span className={`vi-param-value ${isOn ? 'vi-param-value--green' : 'vi-param-value--red'}`}>
                {isOn ? 'Active Surveillance' : 'Inactive'}
              </span>
            </div>
            <div className="vi-param-item">
              <span className="vi-param-label">Recording Status</span>
              <span className={`vi-param-value ${isOn ? 'vi-param-value--green' : 'vi-param-value--muted'}`}>
                {isOn ? 'Active Recording' : 'Stopped'}
              </span>
            </div>
            <div className="vi-param-item">
              <span className="vi-param-label">Feed Status</span>
              <span className="vi-param-value">
                {isOn ? feedStatus : 'OFFLINE'}
              </span>
            </div>
            <div className="vi-param-item">
              <span className="vi-param-label">Observation Status</span>
              <span className="vi-param-value">
                {isOn ? 'Monitoring Sector 7' : 'Not Monitoring'}
              </span>
            </div>
          </div>
        </section>

        {/* Latest System Report */}
        <section className="vi-info-card">
          <div className="vi-info-card-header">
            <h2 className="vi-info-card-title">
              <Target size={16} />
              Latest System Report
            </h2>
          </div>
          <p className="vi-report-text">
            {isOn
              ? `Vision camera is actively monitoring ${activeSubject.sector || 'Sector 7'}. Subject ${activeSubject.subject_id} tagged with confidence ${((activeSubject.confidence || 0.994) * 100).toFixed(1)}%.`
              : 'The Vision camera is turned off. Optical surveillance and event recording are paused.'}
          </p>
        </section>
      </div>

      {/* ── RECENT VISION EVENTS ───────────────────────────────── */}
      <section className="vi-events-card">
        <div className="vi-events-header">
          <h2 className="vi-events-title">
            <AlertTriangle size={18} />
            Recent Vision Events
          </h2>
          <span className="vi-events-subtitle">VISION SOURCE // OPTICAL PIPELINE</span>
        </div>

        {loading ? (
          <div className="vi-events-loading">Loading Vision events...</div>
        ) : events.length > 0 ? (
          <div className="vi-events-list">
            {events.slice(0, 5).map((event, index) => (
              <div key={event.id || index} className="vi-event-row">
                <div className="vi-event-marker" />
                <div className="vi-event-content">
                  <span className="vi-event-type">
                    {event.type || event.event_type || 'Vision Event'}
                  </span>
                  <span className="vi-event-msg">
                    {event.message || event.description || 'Vision observation recorded'}
                  </span>
                </div>
                {event.timestamp && (
                  <span className="vi-event-time">{event.timestamp}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="vi-events-loading">No recent vision events.</div>
        )}
      </section>

    </div>
  );
};

export default VisionIntelligencePage;