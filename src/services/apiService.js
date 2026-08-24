/**
 * ATLAS Command Center — REST API Integration Service
 *
 * Frontend <-> FastAPI Backend
 *
 * Local development:
 * VITE_API_BASE_URL=http://127.0.0.1:8000
 *
 * Production Render Deployment:
 * VITE_API_BASE_URL=https://atlas-command-center-backend.onrender.com
 */

const getBackendUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://atlas-command-center-backend.onrender.com';
  }
  return 'http://127.0.0.1:8000';
};

const API_BASE_URL = getBackendUrl();


/**
 * Generic HTTP request helper
 */
async function safeFetch(endpoint, options = {}) {
  try {
    const url =
      `${API_BASE_URL.replace(/\/$/, '')}/` +
      `${endpoint.replace(/^\//, '')}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      isConnected: true,
      data,
      error: null,
    };
  } catch (error) {
    console.warn(
      `[ATLAS API] ${endpoint} unreachable:`,
      error.message
    );

    return {
      isConnected: false,
      data: null,
      error: error.message,
    };
  }
}


export const apiService = {

  // --------------------------------------------------
  // CONNECTION
  // --------------------------------------------------

  getBaseUrl: () => API_BASE_URL,

  isConfigured: () => Boolean(API_BASE_URL),


  // --------------------------------------------------
  // SYSTEM
  // --------------------------------------------------

  getSystemStatus: () =>
    safeFetch('/api/system/status'),

  getHealth: () =>
    safeFetch('/api/health'),


  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------

  getRecentEvents: (limit = 50) =>
    safeFetch(`/api/events?limit=${limit}`),

  getEventsBySource: (source, limit = 50) =>
    safeFetch(
      `/api/events?source=${encodeURIComponent(source)}&limit=${limit}`
    ),

  getEventById: (eventId) =>
    safeFetch(
      `/api/events/${encodeURIComponent(eventId)}`
    ),

  postEvent: (eventData) =>
    safeFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  triggerDemoSequence: () =>
    safeFetch('/api/events/demo', {
      method: 'POST',
      body: JSON.stringify({}),
    }),


  // --------------------------------------------------
  // VISION
  // --------------------------------------------------

  getVisionStatus: () =>
    safeFetch('/api/vision/status'),

  getVisionDetections: () =>
    safeFetch('/api/vision/detections'),

  getVisionDetectionById: (subjectId) =>
    safeFetch(
      `/api/vision/detections/${encodeURIComponent(subjectId)}`
    ),

  /**
   * User-controlled Vision ON/OFF
   *
   * enabled = true  -> camera ON
   * enabled = false -> camera OFF
   */
  updateVisionStatus: (enabled) =>
    safeFetch(
      `/api/vision/status?enabled=${Boolean(enabled)}`,
      {
        method: 'PUT',
      }
    ),


  // --------------------------------------------------
  // CORE INTELLIGENCE
  // --------------------------------------------------

  getCoreStatus: () =>
    safeFetch('/api/core/status'),

  getCoreDecisions: (limit = 50) =>
    safeFetch(`/api/core/decisions?limit=${limit}`),

  getCoreDecisionById: (decisionId) =>
    safeFetch(
      `/api/core/decisions/${encodeURIComponent(decisionId)}`
    ),

  processCoreEvent: (eventId) =>
    safeFetch('/api/core/process', {
      method: 'POST',
      body: JSON.stringify({
        event_id: eventId,
      }),
    }),


  // --------------------------------------------------
  // SENSOR NETWORK
  // --------------------------------------------------

  getSensorStatus: () =>
    safeFetch('/api/sensors/status'),

  getSensorNodes: () =>
    safeFetch('/api/sensors/nodes'),

  getSensorNodeById: (nodeId) =>
    safeFetch(
      `/api/sensors/nodes/${encodeURIComponent(nodeId)}`
    ),

  getSensorEvents: (limit = 50) =>
    safeFetch(`/api/sensors/events?limit=${limit}`),


  // --------------------------------------------------
  // ACT
  // --------------------------------------------------

  getActStatus: () =>
    safeFetch('/api/act/status'),

  getActMission: () =>
    safeFetch('/api/act/mission'),

  getActHistory: () =>
    safeFetch('/api/act/history'),
};


export default apiService;