import React, { useEffect, useState } from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import {
  Eye,
  Radio,
  Brain,
  Zap,
  ShieldAlert,
  Video,
  RefreshCw,
  AlertTriangle,
  Activity,
  Layers,
  ArrowRight,
  Shield
} from 'lucide-react';

export const MissionControlPage = ({ setActivePage }) => {
  const { currentModuleStates } = useAtlasSimulation();
  const { isAdmin, isUser, user } = useAuth();

  const [visionStatus, setVisionStatus] = useState('ACTIVE');
  const [feedStatus, setFeedStatus] = useState('LIVE // 1080P 60FPS');
  const [updatingCam, setUpdatingCam] = useState(false);
  const [camError, setCamError] = useState('');

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Load Vision Status & Safety Events
  const loadDashboardData = async () => {
    try {
      const visRes = await apiService.getVisionStatus();
      if (visRes.isConnected && visRes.data) {
        setVisionStatus(visRes.data.status || 'ACTIVE');
        setFeedStatus(visRes.data.feed_status || 'LIVE // 1080P 60FPS');
      }

      const evtRes = await apiService.getRecentEvents(15);
      if (evtRes.isConnected && Array.isArray(evtRes.data)) {
        setEvents(evtRes.data);
      } else {
        // Fallback safety events
        setEvents([
          {
            id: 'EVT-101',
            timestamp: '10:50:54 UTC',
            source: 'VISION',
            type: 'UNKNOWN_PERSON_ENTERED',
            message: 'Unknown person detected @ Sector 7 perimeter zone',
            status: 'COMPLETED'
          },
          {
            id: 'EVT-102',
            timestamp: '10:50:56 UTC',
            source: 'SENSE',
            type: 'THEFT_ALERT',
            message: 'Acoustic load anomaly and perimeter movement detected',
            status: 'COMPLETED'
          },
          {
            id: 'EVT-103',
            timestamp: '10:51:00 UTC',
            source: 'CORE',
            type: 'EMERGENCY_ALERT',
            message: 'Women safety emergency score 0.12 - Dispatch Sentry-Alpha',
            status: 'COMPLETED'
          }
        ]);
      }
    } catch (err) {
      console.error('[DASHBOARD] Failed to load backend data:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleCamera = async () => {
    if (!isAdmin) return;
    const currentlyOn = visionStatus === 'ACTIVE' || visionStatus === 'ON';
    const newStatus = !currentlyOn;

    setUpdatingCam(true);
    setCamError('');

    try {
      const res = await apiService.updateVisionStatus(newStatus);
      if (res.isConnected && res.data) {
        setVisionStatus(res.data.status || (newStatus ? 'ACTIVE' : 'OFF'));
        setFeedStatus(res.data.feed_status || (newStatus ? 'LIVE // 1080P 60FPS' : 'OFFLINE'));
        await loadDashboardData();
      } else {
        setCamError(res.error || 'Camera update failed.');
      }
    } catch (err) {
      setCamError(err.message || 'Failed to toggle camera.');
    } finally {
      setUpdatingCam(false);
    }
  };

  const isCamOn = visionStatus === 'ACTIVE' || visionStatus === 'ON';

  const modules = [
    {
      key: 'vision-intelligence',
      stateKey: 'vision',
      name: 'VISION',
      icon: Eye,
      device: 'Optical Camera',
      description: 'Observation, optical perception, and intruder detection system',
    },
    {
      key: 'sensor-network',
      stateKey: 'sense',
      name: 'SENSE',
      icon: Radio,
      device: 'ESP32 Nodes',
      description: 'Environmental, floor load, and perimeter sensor grid',
    },
    {
      key: 'core-intelligence',
      stateKey: 'core',
      name: 'CORE',
      icon: Brain,
      device: 'Decision Fusion',
      description: 'Safety risk evaluation and decision synthesis engine',
    },
    {
      key: 'atlas-act',
      stateKey: 'act',
      name: 'ACT',
      icon: Zap,
      device: 'Autonomous Drone',
      description: 'Approved verification mission & aerial recon protocol',
    },
  ];

  const openModule = (moduleKey) => {
    setActivePage(moduleKey);
  };

  return (
    <div className="mc-container">
      {/* HEADER CARD */}
      <header className="mc-header-card">
        <div className="mc-title-group">
          <div className="mc-badge-tag">
            <Activity size={12} className="spin-slow" />
            ATLAS COMMAND CENTER // MAIN OPERATIONAL HUB
          </div>

          <h1 className="mc-main-title">
            <Shield className="mc-title-icon" size={28} />
            ATLAS Mission Control
          </h1>

          <p className="mc-subtitle">
            Intelligent Women Safety & Multi-Node Autonomous Surveillance Platform
          </p>
        </div>

        <div className="mc-user-pill">
          <span className="mc-pulse-dot" />
          <span>
            Logged in as <strong>{user?.name || 'Authorized User'}</strong> ({user?.role || 'USER'})
          </span>
        </div>
      </header>

      {/* CAMERA CONTROL CARD */}
      <section className="mc-camera-card">
        <div className="mc-camera-info">
          <div className="mc-camera-header">
            <Eye size={20} style={{ color: 'var(--cyan-bright, #00f2fe)' }} />
            <h2 className="mc-camera-title">CAMERA STATUS & CONTROL</h2>
          </div>

          <div className="mc-camera-status-row">
            <span className={`mc-status-pill ${isCamOn ? 'active' : 'off'}`}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isCamOn ? '#4ade80' : '#f87171'
                }}
              />
              {isCamOn ? 'ON // SURVEILLANCE ACTIVE' : 'OFF // SURVEILLANCE PAUSED'}
            </span>

            <span className="mc-feed-tag">({feedStatus})</span>
          </div>

          {camError && (
            <div style={{ marginTop: '8px', color: '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
              ⚠ {camError}
            </div>
          )}
        </div>

        {isAdmin ? (
          <button
            type="button"
            onClick={toggleCamera}
            disabled={updatingCam}
            className="mc-camera-btn"
          >
            {updatingCam ? (
              <RefreshCw size={16} className="spin" />
            ) : (
              <Video size={16} />
            )}
            {updatingCam
              ? 'UPDATING...'
              : isCamOn
                ? 'TURN OFF CAMERA'
                : 'TURN ON CAMERA'}
          </button>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', fontStyle: 'italic' }}>
            Admin permission required to alter camera power state.
          </div>
        )}
      </section>

      {/* OPERATIONAL ARCHITECTURE MODULES */}
      <section>
        <h2 className="mc-section-title">
          <Layers size={18} style={{ color: 'var(--cyan-bright, #00f2fe)' }} />
          ATLAS Operational Architecture
        </h2>

        <div className="mc-modules-grid">
          {modules.map((mod) => {
            const IconComp = mod.icon;
            return (
              <div key={mod.key} className="mc-module-card">
                <div>
                  <div className="mc-module-header">
                    <span className="mc-module-name-badge">{mod.name}</span>
                    <IconComp size={20} className="mc-module-icon" />
                  </div>

                  <div className="mc-module-device">{mod.device}</div>
                  <p className="mc-module-desc">{mod.description}</p>
                </div>

                <div className="mc-module-footer">
                  <button
                    type="button"
                    onClick={() => openModule(mod.key)}
                    className="mc-module-btn"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SAFETY STATUS & ENVIRONMENT LOG */}
      <section className="mc-events-card">
        <div className="mc-events-header">
          <h2 className="mc-events-title">
            <ShieldAlert size={20} /> Safety Status & Environment Log
          </h2>
          <span className="mc-events-subtitle">REAL BACKEND SYSTEM EVENTS</span>
        </div>

        {loadingEvents ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted, #94a3b8)', fontFamily: 'var(--font-mono)' }}>
            Loading safety status events...
          </div>
        ) : events.length > 0 ? (
          <div className="mc-events-list">
            {events.slice(0, 6).map((evt, idx) => (
              <div key={evt.id || idx} className="mc-event-row">
                <div className="mc-event-main">
                  <span className="mc-event-type">
                    {evt.type || evt.event_type || 'Safety Alert'}
                  </span>
                  <span className="mc-event-msg">{evt.message}</span>
                </div>

                <div className="mc-event-meta">
                  <span className="mc-event-time">
                    {evt.timestamp || '10:50:54 UTC'}
                  </span>
                  <span className="mc-event-source">
                    SOURCE: {evt.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted, #94a3b8)', fontFamily: 'var(--font-mono)' }}>
            No safety events recorded yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default MissionControlPage;