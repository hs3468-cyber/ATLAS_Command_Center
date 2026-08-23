import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

export const CoreIntelligencePage = () => {
  const [coreStatus, setCoreStatus] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCoreData = async () => {
    try {
      const [statusResponse, decisionsResponse] =
        await Promise.all([
          apiService.getCoreStatus(),
          apiService.getCoreDecisions(10),
        ]);

      if (
        statusResponse.isConnected &&
        statusResponse.data
      ) {
        setCoreStatus(statusResponse.data);
      }

      if (
        decisionsResponse.isConnected &&
        Array.isArray(decisionsResponse.data)
      ) {
        setDecisions(decisionsResponse.data);
      }
    } catch (error) {
      console.error(
        '[CORE] Failed to load core data:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoreData();

    const interval = setInterval(
      loadCoreData,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const status =
    coreStatus?.status || 'ONLINE';

  const systemState =
    coreStatus?.state || 'MONITORING';

  const processingMode =
    coreStatus?.processing_mode ||
    'RULE_BASED_DEMO';

  const decisionsCount =
    coreStatus?.decisions_count ?? 0;

  const latestDecision =
    decisions.length > 0
      ? decisions[0]
      : null;

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
            Intelligence, context and decision
            information
          </p>
        </div>


        {/* CORE STATUS */}
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
                background:
                  status === 'ONLINE'
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

          <div
            style={{
              marginTop: '12px',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Current system state:{' '}

            <strong
              style={{
                color: '#374151',
              }}
            >
              {systemState}
            </strong>
          </div>

          <div
            style={{
              marginTop: '8px',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Processing mode:{' '}

            <strong
              style={{
                color: '#374151',
              }}
            >
              {processingMode}
            </strong>
          </div>

          <div
            style={{
              marginTop: '8px',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Decisions generated:{' '}

            <strong
              style={{
                color: '#374151',
              }}
            >
              {decisionsCount}
            </strong>
          </div>
        </div>


        {/* CURRENT INPUT */}
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
            Current Input
          </h2>

          <p
            style={{
              margin: 0,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            {latestDecision?.context_summary ||
              latestDecision?.inputReceived ||
              'Information received from Vision and Sense.'}
          </p>
        </div>


        {/* ASSESSMENT */}
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
            Assessment
          </h2>

          <p
            style={{
              margin: 0,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            {latestDecision?.assessment ||
              'The available information is being evaluated to understand the current situation.'}
          </p>
        </div>


        {/* DECISION */}
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
            {latestDecision?.decision ||
              'No new decision is currently available.'}
          </p>

          {latestDecision?.approved_action && (
            <div
              style={{
                marginTop: '12px',
                color: '#4b5563',
                lineHeight: '1.6',
              }}
            >
              <strong>
                Approved Action:
              </strong>{' '}
              {latestDecision.approved_action}
            </div>
          )}
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
            ATLAS Core is processing information
            received from connected modules and
            producing decisions based on the
            available context.
          </p>
        </div>


        {/* DECISION HISTORY */}
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
            Recent Decision History
          </h2>

          {loading ? (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              Loading Core decisions...
            </p>
          ) : decisions.length > 0 ? (
            decisions
              .slice(0, 5)
              .map((decision, index) => (
                <div
                  key={
                    decision.decision_id ||
                    decision.id ||
                    index
                  }
                  style={{
                    padding:
                      '12px 0',
                    borderBottom:
                      index <
                        Math.min(
                          decisions.length,
                          5
                        ) - 1
                        ? '1px solid #e5e7eb'
                        : 'none',
                  }}
                >
                  <strong>
                    {decision.decision ||
                      'Decision generated'}
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
                    {decision.assessment ||
                      decision.context_summary ||
                      'Core decision recorded.'}
                  </div>

                  {decision.approved_action && (
                    <div
                      style={{
                        marginTop:
                          '5px',
                        color:
                          '#6b7280',
                        fontSize:
                          '13px',
                      }}
                    >
                      Action:{' '}
                      {decision.approved_action}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              No Core decisions available.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default CoreIntelligencePage;