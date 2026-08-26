import React, { useEffect, useState } from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Eye, Radio, Brain, Zap, ShieldAlert, Video, RefreshCw, AlertTriangle } from 'lucide-react';

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
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1f2937',
        padding: '40px 30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 600, color: '#111827' }}>
            ATLAS Command Center
          </h1>
          <p style={{ margin: '8px 0 16px', fontSize: '15px', color: '#6b7280' }}>
            Intelligent Women Safety & Surveillance System
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              background: '#f9fafb',
              fontSize: '13px',
              color: '#374151',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            Logged in as <strong>{user?.name || 'Authorized User'}</strong> ({user?.role || 'USER'})
          </div>
        </div>

        {/* CAMERA CONTROL CARD (ADMIN PROMINENT CONTROL / USER READ-ONLY) */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '30px',
            background: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Eye size={20} style={{ color: '#2563eb' }} />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                CAMERA STATUS & CONTROL
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: isCamOn ? '#22c55e' : '#ef4444',
                }}
              />
              <strong style={{ fontSize: '16px', color: '#111827' }}>
                {isCamOn ? 'ON // SURVEILLANCE ACTIVE' : 'OFF // SURVEILLANCE PAUSED'}
              </strong>
              <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '10px' }}>
                ({feedStatus})
              </span>
            </div>

            {camError && (
              <div style={{ marginTop: '8px', color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>
                ⚠ {camError}
              </div>
            )}
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={toggleCamera}
              disabled={updatingCam}
              style={{
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: updatingCam ? 'not-allowed' : 'pointer',
                opacity: updatingCam ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {updatingCam && <RefreshCw size={16} className="spin" />}
              {updatingCam
                ? 'UPDATING...'
                : isCamOn
                  ? 'TURN OFF CAMERA'
                  : 'TURN ON CAMERA'}
            </button>
          ) : (
            <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
              Admin permission required to alter camera power state.
            </div>
          )}
        </div>

        {/* 4 CONCEPT REFERENCE MODULES */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
            ATLAS Operational Architecture
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {modules.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.key}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    padding: '20px',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>
                        {mod.name}
                      </span>
                      <IconComp size={18} style={{ color: '#111827' }} />
                    </div>

                    <strong style={{ fontSize: '15px', color: '#111827', display: 'block', marginBottom: '4px' }}>
                      {mod.device}
                    </strong>

                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
                      {mod.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => openModule(mod.key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WOMEN SAFETY & SURVEILLANCE VIEW STATUS SECTION */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            padding: '24px',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} style={{ color: '#dc2626' }} /> Safety Status & Environment Log
            </h2>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              Real Backend System Events
            </span>
          </div>

          {loadingEvents ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              Loading safety status events...
            </div>
          ) : events.length > 0 ? (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {events.slice(0, 6).map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  style={{
                    padding: '14px 18px',
                    borderBottom: idx !== Math.min(events.length, 6) - 1 ? '1px solid #e5e7eb' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '14px',
                  }}
                >
                  <div>
                    <strong style={{ color: '#111827', fontSize: '14px', display: 'block' }}>
                      {evt.type || evt.event_type || 'Safety Alert'}
                    </strong>
                    <span style={{ color: '#4b5563', fontSize: '13px', marginTop: '2px', display: 'block' }}>
                      {evt.message}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right', shrink: 0 }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>
                      {evt.timestamp || '10:50:54 UTC'}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>
                      SOURCE: {evt.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              No safety events recorded yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MissionControlPage;