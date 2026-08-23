import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';

export const SensorNetworkPage = () => {
  const { currentModuleStates } = useAtlasSimulation();

  const senseState = currentModuleStates?.sense;

  const status =
    senseState?.status ||
    senseState?.stateSummary ||
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
            SENSE
          </h1>

          <p
            style={{
              marginTop: '7px',
              color: '#6b7280',
              fontSize: '15px',
            }}
          >
            Sensor network and environmental information
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
          <h2 style={{ margin: '0 0 15px', fontSize: '18px' }}>
            Sensor Status
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

        {/* Current Readings */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 18px', fontSize: '18px' }}>
            Current Readings
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '18px',
            }}
          >
            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Motion
              </div>
              <strong>Detected</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Distance
              </div>
              <strong>2.4 meters</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Sensor Network
              </div>
              <strong>Connected</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Monitoring
              </div>
              <strong>Active</strong>
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
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Current Report
          </h2>

          <p
            style={{
              margin: 0,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            The sensor network is connected and actively monitoring
            the environment. Motion has been detected in the monitored
            area and the current sensor readings are available.
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
          <h2 style={{ margin: '0 0 15px', fontSize: '18px' }}>
            Recent History
          </h2>

          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <strong>Motion detected</strong>
            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Sensor recorded movement in the monitored area.
            </div>
          </div>

          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <strong>Distance updated</strong>
            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Current measured distance: 2.4 meters.
            </div>
          </div>

          <div style={{ padding: '12px 0' }}>
            <strong>Sensor network connected</strong>
            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Sensor monitoring is active.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorNetworkPage;