import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';

export const AtlasActPage = () => {
  const {
    activeStep,
    actMissionProgress,
    currentModuleStates,
  } = useAtlasSimulation();

  const actState = currentModuleStates?.act;

  const isExecuting = activeStep >= 4;

  const status =
    actState?.status ||
    actState?.stateSummary ||
    (isExecuting ? 'EXECUTING' : 'READY');

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
            ACT
          </h1>

          <p
            style={{
              marginTop: '7px',
              color: '#6b7280',
              fontSize: '15px',
            }}
          >
            Drone status, mission and approved action information
          </p>
        </div>

        {/* Drone Status */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 15px', fontSize: '18px' }}>
            Drone Status
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

        {/* Mission */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 18px', fontSize: '18px' }}>
            Current Mission
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
                Mission Status
              </div>

              <strong>
                {isExecuting ? 'In Progress' : 'Standby'}
              </strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Mission Progress
              </div>

              <strong>{actMissionProgress || 0}%</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Connection
              </div>

              <strong>Connected</strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Safety Status
              </div>

              <strong>Normal</strong>
            </div>
          </div>
        </div>

        {/* Current Action */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Current Action
          </h2>

          <p
            style={{
              margin: 0,
              color: '#374151',
              lineHeight: '1.6',
              fontWeight: 600,
            }}
          >
            {isExecuting
              ? 'Drone is executing the approved mission.'
              : 'Drone is ready and waiting for an approved mission.'}
          </p>
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
            The ACT module is connected to the drone system. The
            dashboard displays the current mission status, progress
            and approved action information.
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
            <strong>Drone connected</strong>

            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Drone connection is available to the ATLAS system.
            </div>
          </div>

          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <strong>Mission status checked</strong>

            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Current mission and execution status were updated.
            </div>
          </div>

          <div style={{ padding: '12px 0' }}>
            <strong>Safety status normal</strong>

            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              No current safety issue is reported.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasActPage;