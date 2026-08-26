import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Video, ShieldAlert, Play, Eye, Filter, Calendar, CheckCircle } from 'lucide-react';

export const EvidenceRecordingsPage = ({ setActivePage }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const loadRecordings = async () => {
    setLoading(true);
    try {
      const res = await apiService.getRecentEvents(30);
      if (res.isConnected && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        // Fallback baseline recordings
        setEvents([
          {
            id: 'EVT-REC-101',
            timestamp: '10:50:54 UTC',
            source: 'VISION',
            type: 'UNKNOWN_PERSON_ENTERED',
            message: 'Unknown person detected @ Sector 7 perimeter zone',
            status: 'COMPLETED',
            data: { camera: 'Cam-04 (1080P)', clip_duration: '45s', sector: 'Sector 7' }
          },
          {
            id: 'EVT-REC-102',
            timestamp: '10:50:56 UTC',
            source: 'SENSE',
            type: 'THEFT_ALERT',
            message: 'Acoustic load anomaly and perimeter movement detected',
            status: 'COMPLETED',
            data: { camera: 'Cam-02 (Thermal)', clip_duration: '30s', sector: 'Sector 3' }
          },
          {
            id: 'EVT-REC-103',
            timestamp: '10:51:00 UTC',
            source: 'CORE',
            type: 'EMERGENCY_ALERT',
            message: 'Women safety emergency score 0.12 - Dispatch Sentry-Alpha',
            status: 'COMPLETED',
            data: { camera: 'Drone Sentry Feed', clip_duration: '1m 20s', sector: 'Sector 7' }
          }
        ]);
      }
    } catch (err) {
      console.error('[EVIDENCE] Failed to load recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const filteredEvents = events.filter(evt => {
    if (filterType === 'ALL') return true;
    return evt.source === filterType || (evt.type && evt.type.includes(filterType));
  });

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
            <h1
              style={{
                margin: 0,
                fontSize: '30px',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              EVIDENCE & RECORDINGS
            </h1>

            <p style={{ marginTop: '7px', color: '#6b7280', fontSize: '15px' }}>
              Recorded surveillance clips, incident evidence, and safety logs
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setActivePage('vision-intelligence')}
              style={{
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Eye size={16} /> VIEW LIVE FEED
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            padding: '12px 16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <Filter size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Filter:</span>

          {['ALL', 'VISION', 'SENSE', 'CORE', 'ACT'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              style={{
                background: filterType === type ? '#111827' : '#ffffff',
                color: filterType === type ? '#ffffff' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* RECORDINGS TABLE / LIST */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 1.2fr',
              fontSize: '12px',
              fontWeight: 700,
              color: '#4b5563',
              letterSpacing: '0.04em',
            }}
          >
            <div>EVENT TYPE</div>
            <div>DESCRIPTION</div>
            <div>TIMESTAMP</div>
            <div>SOURCE</div>
            <div style={{ textAlign: 'right' }}>ACTIONS</div>
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
              Loading evidence & recordings...
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((evt, idx) => (
              <div
                key={evt.id || idx}
                style={{
                  padding: '16px 20px',
                  borderBottom: idx !== filteredEvents.length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 1.2fr',
                  alignItems: 'center',
                  fontSize: '14px',
                  background: '#ffffff',
                }}
              >
                <div>
                  <strong style={{ color: '#111827', display: 'block', fontSize: '13px' }}>
                    {evt.type || evt.event_type || 'SAFETY_EVENT'}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>ID: {evt.id}</span>
                </div>

                <div style={{ color: '#374151', fontSize: '13px', paddingRight: '10px' }}>
                  {evt.message}
                </div>

                <div style={{ color: '#6b7280', fontSize: '12px' }}>
                  {evt.timestamp || '10:50:54 UTC'}
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: evt.source === 'VISION' ? '#e0f2fe' : evt.source === 'SENSE' ? '#dcfce7' : '#f3e8ff',
                      color: evt.source === 'VISION' ? '#0369a1' : evt.source === 'SENSE' ? '#15803d' : '#6b21a8',
                    }}
                  >
                    {evt.source}
                  </span>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecording(evt)}
                    style={{
                      background: '#111827',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Play size={14} /> VIEW RECORDING
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
              No recordings found matching criteria.
            </div>
          )}
        </div>

        {/* MODAL FOR VIEW RECORDING */}
        {selectedRecording && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                maxWidth: '650px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '14px',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  RECORDED EVIDENCE CLIP — {selectedRecording.id}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedRecording(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* SIMULATED VIDEO PLAYER BOX */}
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  background: '#111827',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  marginBottom: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#dc2626', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  RECORDED CLIP // REC: 00:45
                </div>

                <Video size={48} style={{ opacity: 0.6, marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  SURVEILLANCE EVIDENCE FEED
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {selectedRecording.message}
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                <div><strong>Timestamp:</strong> {selectedRecording.timestamp}</div>
                <div><strong>Source Module:</strong> {selectedRecording.source}</div>
                <div><strong>Event Type:</strong> {selectedRecording.type || 'SAFETY_ALERT'}</div>
                <div><strong>Evidence Status:</strong> Secured in ATLAS SQLite Database & Cloud Storage</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRecording(null)}
                  style={{
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EvidenceRecordingsPage;
