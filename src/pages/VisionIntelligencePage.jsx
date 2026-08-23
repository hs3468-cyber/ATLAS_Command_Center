import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { visionEventsData } from '../mock/visionData';

export const VisionIntelligencePage = () => {
  const { currentModuleStates } = useAtlasSimulation();

  const visionState = currentModuleStates?.vision;

  const status =
    visionState?.status ||
    visionState?.stateSummary ||
    'ONLINE';

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
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
            marginBottom: '25px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '30px',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            VISION
          </h1>

          <p
            style={{
              marginTop: '7px',
              color: '#6b7280',
              fontSize: '15px',
            }}
          >
            Camera and surveillance information
          </p>
        </div>

        {/* Status */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 15px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Camera Status
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '16px',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22c55e',
              }}
            />

            <strong>{status}</strong>
          </div>
        </div>

        {/* Surveillance */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 15px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Surveillance
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
            }}
          >
            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Mode
              </div>
              <strong>Active Surveillance</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Recording
              </div>
              <strong>Active</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Recording Time
              </div>
              <strong>08:00 AM — Present</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Observation Status
              </div>
              <strong>Monitoring</strong>
            </div>
          </div>
        </div>

        {/* Report */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Current Report
          </h2>

          <p
            style={{
              margin: 0,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            The Vision camera is currently operating in surveillance
            mode. The system is monitoring the environment and recording
            observations. No unusual activity is currently reported.
          </p>
        </div>

        {/* History */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 15px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Recent History
          </h2>

          {visionEventsData?.length > 0 ? (
            visionEventsData.slice(0, 5).map((event, index) => (
              <div
                key={event.id || index}
                style={{
                  padding: '12px 0',
                  borderBottom:
                    index !== Math.min(visionEventsData.length, 5) - 1
                      ? '1px solid #e5e7eb'
                      : 'none',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#374151',
                  }}
                >
                  {event.eventType || event.type || 'Vision Event'}
                </strong>

                <span
                  style={{
                    display: 'block',
                    marginTop: '4px',
                    fontSize: '13px',
                    color: '#6b7280',
                  }}
                >
                  {event.description ||
                    event.message ||
                    'Vision observation recorded'}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280' }}>
              No recent vision events.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionIntelligencePage;