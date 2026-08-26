import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Settings } from 'lucide-react';

export const AtlasActPage = ({ setActivePage }) => {
  const { isAdmin } = useAuth();
  const [actStatus, setActStatus] = useState(null);
  const [mission, setMission] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActData = async () => {
    try {
      const [
        statusResponse,
        missionResponse,
        historyResponse,
      ] = await Promise.all([
        apiService.getActStatus(),
        apiService.getActMission(),
        apiService.getActHistory(),
      ]);

      if (
        statusResponse.isConnected &&
        statusResponse.data
      ) {
        setActStatus(statusResponse.data);
      }

      if (
        missionResponse.isConnected &&
        missionResponse.data
      ) {
        setMission(missionResponse.data);
      }

      if (
        historyResponse.isConnected &&
        Array.isArray(historyResponse.data)
      ) {
        setHistory(historyResponse.data);
      }
    } catch (error) {
      console.error(
        '[ACT] Failed to load ACT data:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActData();

    const interval = setInterval(
      loadActData,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const status =
    actStatus?.status || 'READY';

  const missionId =
    mission?.mission_id ||
    actStatus?.current_mission_id ||
    'No active mission';

  const missionName =
    mission?.name ||
    'No active mission';

  const unit =
    mission?.unit ||
    actStatus?.unit_status ||
    'STANDBY';

  const stage =
    mission?.stage ||
    'VERIFICATION';

  const progress =
    mission?.progress ?? 0;

  const executionStatus =
    mission?.execution_status ||
    'STANDBY';

  const battery =
    mission?.battery_demo_value ?? 0;

  const signal =
    mission?.signal_demo_value ?? 0;

  const telemetry =
    mission?.telemetry_summary ||
    'No telemetry available.';

  const isExecuting =
    executionStatus === 'EXECUTING';

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

        {/* HEADER */}
        <div
          style={{
            borderBottom:
              '1px solid #e5e7eb',
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
              ACT
            </h1>

            <p
              style={{
                marginTop: '7px',
                color: '#6b7280',
                fontSize: '15px',
              }}
            >
              Drone status, mission and approved
              action information
            </p>
          </div>

          {isAdmin && setActivePage && (
            <button
              type="button"
              onClick={() => setActivePage('drone-setup')}
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
              <Settings size={16} /> DRONE ACTIVATION SETUP
            </button>
          )}
        </div>


        {/* DRONE STATUS */}
        <div
          style={{
            border:
              '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 15px',
              fontSize: '18px',
            }}
          >
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
                background:
                  status === 'READY' ||
                    status === 'EXECUTING'
                    ? '#22c55e'
                    : '#ef4444',
              }}
            />

            <strong>
              {loading
                ? 'LOADING...'
                : status}
            </strong>
          </div>
        </div>


        {/* CURRENT MISSION */}
        <div
          style={{
            border:
              '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 18px',
              fontSize: '18px',
            }}
          >
            Current Mission
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(2, 1fr)',
              gap: '18px',
            }}
          >

            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Mission ID
              </div>

              <strong>
                {missionId}
              </strong>
            </div>


            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Mission Name
              </div>

              <strong>
                {missionName}
              </strong>
            </div>


            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Mission Status
              </div>

              <strong>
                {isExecuting
                  ? 'In Progress'
                  : executionStatus}
              </strong>
            </div>


            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Mission Progress
              </div>

              <strong>
                {progress}%
              </strong>
            </div>


            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Assigned Unit
              </div>

              <strong>
                {unit}
              </strong>
            </div>


            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Mission Stage
              </div>

              <strong>
                {stage}
              </strong>
            </div>

          </div>
        </div>


        {/* TELEMETRY */}
        <div
          style={{
            border:
              '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 18px',
              fontSize: '18px',
            }}
          >
            Telemetry
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(2, 1fr)',
              gap: '18px',
            }}
          >

            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Battery
              </div>

              <strong>
                {battery}%
              </strong>
            </div>


            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Signal
              </div>

              <strong>
                {signal}%
              </strong>
            </div>


            <div
              style={{
                gridColumn:
                  '1 / -1',
              }}
            >
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Telemetry Summary
              </div>

              <strong>
                {telemetry}
              </strong>
            </div>

          </div>
        </div>


        {/* CURRENT ACTION */}
        <div
          style={{
            border:
              '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 12px',
              fontSize: '18px',
            }}
          >
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
              ? 'The assigned unit is executing the approved mission.'
              : 'The ACT system is ready and waiting for an approved mission.'}
          </p>
        </div>


        {/* REPORT */}
        <div
          style={{
            border:
              '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 12px',
              fontSize: '18px',
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
            The ACT module is connected to the
            backend and displays the current
            mission, execution state and telemetry
            information returned by the ATLAS
            system.
          </p>
        </div>


        {/* HISTORY */}
        <div
          style={{
            border:
              '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin:
                '0 0 15px',
              fontSize: '18px',
            }}
          >
            Recent History
          </h2>

          {loading ? (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              Loading ACT history...
            </p>
          ) : history.length > 0 ? (
            history
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={
                    item.mission_id ||
                    item.id ||
                    index
                  }
                  style={{
                    padding:
                      '12px 0',
                    borderBottom:
                      index <
                        Math.min(
                          history.length,
                          5
                        ) - 1
                        ? '1px solid #e5e7eb'
                        : 'none',
                  }}
                >
                  <strong>
                    {item.name ||
                      item.mission_id ||
                      'Mission event'}
                  </strong>

                  <div
                    style={{
                      marginTop:
                        '4px',
                      color:
                        '#6b7280',
                      fontSize:
                        '13px',
                    }}
                  >
                    {item.execution_status ||
                      item.stage ||
                      'Mission status recorded.'}
                  </div>
                </div>
              ))
          ) : (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              No ACT mission history
              available.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AtlasActPage;