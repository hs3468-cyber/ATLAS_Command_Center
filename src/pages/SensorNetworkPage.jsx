import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

export const SensorNetworkPage = () => {
  const [status, setStatus] = useState('ONLINE');
  const [nodes, setNodes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSensorData = async () => {
    try {
      const [statusResponse, nodesResponse, eventsResponse] =
        await Promise.all([
          apiService.getSensorStatus(),
          apiService.getSensorNodes(),
          apiService.getSensorEvents(10),
        ]);

      if (statusResponse.isConnected && statusResponse.data) {
        setStatus(
          statusResponse.data.status || 'ONLINE'
        );
      }

      if (
        nodesResponse.isConnected &&
        Array.isArray(nodesResponse.data)
      ) {
        setNodes(nodesResponse.data);
      }

      if (
        eventsResponse.isConnected &&
        Array.isArray(eventsResponse.data)
      ) {
        setEvents(eventsResponse.data);
      }
    } catch (error) {
      console.error(
        '[SENSE] Failed to load sensor data:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensorData();

    // Refresh sensor information every 5 seconds.
    const interval = setInterval(
      loadSensorData,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  // Use the first available sensor node for the
  // current-reading summary.
  const currentNode = nodes[0];

  const motion =
    currentNode?.motion || 'CLEAR';

  const distance =
    currentNode?.distance_m ??
    0;

  const temperature =
    currentNode?.temp_c ??
    0;

  const battery =
    currentNode?.battery_level ??
    0;

  const onlineNodes =
    nodes.filter(
      (node) =>
        node.status === 'ONLINE'
    ).length;

  const networkConnected =
    nodes.length > 0;

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
            SENSE
          </h1>

          <p
            style={{
              marginTop: '7px',
              color: '#6b7280',
              fontSize: '15px',
            }}
          >
            Sensor network and environmental
            information
          </p>
        </div>


        {/* STATUS */}
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
              margin: '0 0 15px',
              fontSize: '18px',
            }}
          >
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
        </div>


        {/* CURRENT READINGS */}
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
            Current Readings
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(2, 1fr)',
              gap: '18px',
            }}
          >

            {/* Motion */}
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Motion
              </div>

              <strong>
                {motion}
              </strong>
            </div>


            {/* Distance */}
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Distance
              </div>

              <strong>
                {distance} meters
              </strong>
            </div>


            {/* Network */}
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Sensor Network
              </div>

              <strong>
                {networkConnected
                  ? `${onlineNodes} node(s) connected`
                  : 'No nodes available'}
              </strong>
            </div>


            {/* Monitoring */}
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Monitoring
              </div>

              <strong>
                {status === 'ONLINE'
                  ? 'Active'
                  : 'Inactive'}
              </strong>
            </div>


            {/* Temperature */}
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Temperature
              </div>

              <strong>
                {temperature} °C
              </strong>
            </div>


            {/* Battery */}
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

          </div>
        </div>


        {/* SENSOR NODES */}
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
            Sensor Nodes
          </h2>

          {nodes.length === 0 ? (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              No sensor nodes available.
            </p>
          ) : (
            nodes.map((node) => (
              <div
                key={node.node_id}
                style={{
                  padding:
                    '12px 0',
                  borderBottom:
                    '1px solid #e5e7eb',
                }}
              >
                <strong>
                  {node.node_id}
                </strong>

                <div
                  style={{
                    marginTop: '5px',
                    color: '#6b7280',
                    fontSize: '13px',
                  }}
                >
                  {node.name} ·{' '}
                  {node.status} ·{' '}
                  {node.health}
                </div>
              </div>
            ))
          )}
        </div>


        {/* CURRENT REPORT */}
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
            {status === 'ONLINE'
              ? `The SENSE network is online and receiving environmental information. Current motion status is ${motion}, with a measured distance of ${distance} meters.`
              : 'The SENSE network is currently unavailable.'}
          </p>
        </div>


        {/* RECENT HISTORY */}
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
              Loading sensor events...
            </p>
          ) : events.length > 0 ? (
            events
              .slice(0, 5)
              .map((event, index) => (
                <div
                  key={
                    event.id || index
                  }
                  style={{
                    padding:
                      '12px 0',
                    borderBottom:
                      index <
                        Math.min(
                          events.length,
                          5
                        ) - 1
                        ? '1px solid #e5e7eb'
                        : 'none',
                  }}
                >
                  <strong>
                    {event.type ||
                      'Sensor Event'}
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
                    {event.message ||
                      'Sensor event recorded'}
                  </div>
                </div>
              ))
          ) : (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              No recent sensor events.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default SensorNetworkPage;