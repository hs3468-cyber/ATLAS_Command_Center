import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { visionEventsData } from '../mock/visionData';

export const VisionIntelligencePage = () => {
  const [visionStatus, setVisionStatus] = useState('ACTIVE');
  const [feedStatus, setFeedStatus] = useState('LIVE // 1080P 60FPS');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --------------------------------------------------
  // Load Vision data from FastAPI
  // --------------------------------------------------
  const loadVisionData = async () => {
    try {
      const statusResponse = await apiService.getVisionStatus();

      if (statusResponse.isConnected && statusResponse.data) {
        setVisionStatus(statusResponse.data.status || 'ACTIVE');
        setFeedStatus(
          statusResponse.data.feed_status ||
          'LIVE // 1080P 60FPS'
        );
      }

      const eventsResponse =
        await apiService.getEventsBySource('VISION', 10);

      if (
        eventsResponse.isConnected &&
        Array.isArray(eventsResponse.data)
      ) {
        setEvents(eventsResponse.data);
      } else {
        setEvents(visionEventsData || []);
      }
    } catch (error) {
      console.error(
        '[VISION] Failed to load backend data:',
        error
      );

      setEvents(visionEventsData || []);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load when page opens
  // --------------------------------------------------
  useEffect(() => {
    loadVisionData();
  }, []);

  // --------------------------------------------------
  // User-controlled ON / OFF
  // --------------------------------------------------
  const toggleVision = async () => {
    const currentlyOn =
      visionStatus === 'ACTIVE' ||
      visionStatus === 'ON';

    const newStatus = !currentlyOn;

    setUpdating(true);

    try {
      const response =
        await apiService.updateVisionStatus(newStatus);

      if (response.isConnected && response.data) {
        setVisionStatus(
          response.data.status ||
          (newStatus ? 'ACTIVE' : 'OFF')
        );

        setFeedStatus(
          response.data.feed_status ||
          (newStatus
            ? 'LIVE // 1080P 60FPS'
            : 'OFFLINE')
        );

        // Refresh state from backend
        await loadVisionData();
      } else {
        console.error(
          '[VISION] Backend update failed:',
          response.error
        );
      }
    } catch (error) {
      console.error(
        '[VISION] Toggle failed:',
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  const isOn =
    visionStatus === 'ACTIVE' ||
    visionStatus === 'ON';

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


        {/* CAMERA STATUS */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div>
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
                    background: isOn
                      ? '#22c55e'
                      : '#ef4444',
                  }}
                />

                <strong>
                  {isOn ? 'ON' : 'OFF'}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleVision}
              disabled={updating}
              style={{
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 25px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: updating
                  ? 'not-allowed'
                  : 'pointer',
                opacity: updating ? 0.6 : 1,
              }}
            >
              {updating
                ? 'UPDATING...'
                : isOn
                  ? 'TURN OFF'
                  : 'TURN ON'}
            </button>
          </div>
        </div>


        {/* SURVEILLANCE */}
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
              gridTemplateColumns:
                'repeat(2, 1fr)',
              gap: '15px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Mode
              </div>

              <strong>
                {isOn
                  ? 'Active Surveillance'
                  : 'Inactive'}
              </strong>
            </div>

            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Recording
              </div>

              <strong>
                {isOn ? 'Active' : 'Stopped'}
              </strong>
            </div>

            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Feed Status
              </div>

              <strong>
                {isOn
                  ? feedStatus
                  : 'OFFLINE'}
              </strong>
            </div>

            <div>
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                Observation Status
              </div>

              <strong>
                {isOn
                  ? 'Monitoring'
                  : 'Not Monitoring'}
              </strong>
            </div>
          </div>
        </div>


        {/* CURRENT REPORT */}
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
            {isOn
              ? 'The Vision camera is currently operating in surveillance mode. The system is monitoring the environment and recording observations.'
              : 'The Vision camera is currently turned off by the user. Surveillance and recording are inactive.'}
          </p>
        </div>


        {/* RECENT HISTORY */}
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

          {loading ? (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              Loading Vision events...
            </p>
          ) : events.length > 0 ? (
            events.slice(0, 5).map(
              (event, index) => (
                <div
                  key={
                    event.id || index
                  }
                  style={{
                    padding: '12px 0',
                    borderBottom:
                      index !==
                        Math.min(
                          events.length,
                          5
                        ) - 1
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
                    {event.type ||
                      event.eventType ||
                      'Vision Event'}
                  </strong>

                  <span
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      fontSize: '13px',
                      color: '#6b7280',
                    }}
                  >
                    {event.message ||
                      event.description ||
                      'Vision observation recorded'}
                  </span>
                </div>
              )
            )
          ) : (
            <p
              style={{
                color: '#6b7280',
              }}
            >
              No recent vision events.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default VisionIntelligencePage;