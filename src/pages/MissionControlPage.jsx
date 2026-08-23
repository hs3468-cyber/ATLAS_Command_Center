import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';

export const MissionControlPage = ({ setActivePage }) => {
  const { currentModuleStates } = useAtlasSimulation();

  const modules = [
    {
      key: 'vision-intelligence',
      stateKey: 'vision',
      name: 'VISION',
      device: 'Camera',
      description: 'Observation and surveillance system',
    },
    {
      key: 'sensor-network',
      stateKey: 'sense',
      name: 'SENSE',
      device: 'Sensors',
      description: 'Environmental and physical sensor network',
    },
    {
      key: 'core-intelligence',
      stateKey: 'core',
      name: 'CORE',
      device: 'Intelligence',
      description: 'Information processing and decision system',
    },
    {
      key: 'atlas-act',
      stateKey: 'act',
      name: 'ACT',
      device: 'Drone',
      description: 'Approved mission and action system',
    },
  ];

  const getStatus = (stateKey) => {
    const moduleState = currentModuleStates?.[stateKey];

    if (!moduleState) {
      return 'OFFLINE';
    }

    // Prefer the actual backend status
    if (moduleState.status) {
      return moduleState.status;
    }

    if (moduleState.stateSummary) {
      return moduleState.stateSummary;
    }

    return 'ONLINE';
  };

  const isOnline = (stateKey) => {
    const status = getStatus(stateKey).toUpperCase();

    return ![
      'OFF',
      'OFFLINE',
      'INACTIVE',
      'STOPPED',
      'ERROR',
      'NOT MONITORING',
    ].includes(status);
  };

  const openModule = (moduleKey) => {
    setActivePage(moduleKey);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1f2937',
        padding: '50px 30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '45px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            ATLAS Command Center
          </h1>

          <p
            style={{
              margin: '10px 0 18px',
              fontSize: '16px',
              color: '#6b7280',
            }}
          >
            Connected device and system overview
          </p>

          {/* SYSTEM STATUS */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              background: '#f9fafb',
              fontSize: '14px',
              color: '#374151',
            }}
          >
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#22c55e',
              }}
            />

            System Online
          </div>
        </div>

        {/* FOUR MODULES */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {modules.map((module) => {
            const status = getStatus(module.stateKey);
            const online = isOnline(module.stateKey);

            return (
              <div
                key={module.key}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '28px',
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}
                >
                  CONNECTED DEVICE
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: '25px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  {module.name}
                </h2>

                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '16px',
                    color: '#374151',
                  }}
                >
                  {module.device}
                </div>

                <p
                  style={{
                    margin: '15px 0',
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    minHeight: '42px',
                  }}
                >
                  {module.description}
                </p>

                {/* STATUS */}
                <div
                  style={{
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                    }}
                  >
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: online
                          ? '#22c55e'
                          : '#ef4444',
                      }}
                    />

                    Status:{' '}
                    <strong>
                      {status}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => openModule(module.key)}
                    style={{
                      background: '#111827',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '9px 15px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '35px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '13px',
          }}
        >
          ATLAS connects observation, sensing, intelligence and
          approved action in one system.
        </div>
      </div>
    </div>
  );
};

export default MissionControlPage;