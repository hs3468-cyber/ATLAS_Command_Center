import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';

export const CoreIntelligencePage = () => {
  const {
    currentCoreDecision,
    currentSystemState,
    currentModuleStates,
  } = useAtlasSimulation();

  const coreState = currentModuleStates?.core;

  const status =
    coreState?.status ||
    coreState?.stateSummary ||
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
            CORE
          </h1>

          <p
            style={{
              marginTop: '7px',
              color: '#6b7280',
              fontSize: '15px',
            }}
          >
            Intelligence, context and decision information
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
            Core Status
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

          <div
            style={{
              marginTop: '12px',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Current system state:{' '}
            <strong style={{ color: '#374151' }}>
              {currentSystemState || 'Monitoring'}
            </strong>
          </div>
        </div>

        {/* Current Input */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Current Input
          </h2>

          <p
            style={{
              margin: 0,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            {currentCoreDecision?.inputReceived ||
              'Information received from Vision and Sense.'}
          </p>
        </div>

        {/* Context */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Context
          </h2>

          <p
            style={{
              margin: 0,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            {currentCoreDecision?.context ||
              'The available information is being evaluated to understand the current situation.'}
          </p>
        </div>

        {/* Decision */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>
            Current Decision
          </h2>

          <p
            style={{
              margin: 0,
              color: '#374151',
              lineHeight: '1.6',
              fontWeight: 600,
            }}
          >
            {currentCoreDecision?.decision ||
              'No new decision is currently required.'}
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
            ATLAS Core is processing information received from the
            connected modules. It combines the available context and
            produces a concise decision for the current situation.
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
            Recent Decision History
          </h2>

          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <strong>Information received</strong>

            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Vision and Sense information processed by Core.
            </div>
          </div>

          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <strong>Context evaluated</strong>

            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Available information was evaluated for the current
              situation.
            </div>
          </div>

          <div style={{ padding: '12px 0' }}>
            <strong>Decision generated</strong>

            <div
              style={{
                marginTop: '4px',
                color: '#6b7280',
                fontSize: '13px',
              }}
            >
              Current decision is available to the ATLAS system.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreIntelligencePage;