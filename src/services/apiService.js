/**
 * ATLAS Command Center — REST API Integration Service
 *
 * Frontend <-> FastAPI Backend
 *
 * Local development:
 * VITE_API_BASE_URL=http://127.0.0.1:8001
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
  return 'http://127.0.0.1:8001';
};

const API_BASE_URL = getBackendUrl();

/**
 * Generic HTTP request helper
 */
async function safeFetch(endpoint, options = {}, token = null) {
  try {
    const url =
      `${API_BASE_URL.replace(/\/$/, '')}/` +
      `${endpoint.replace(/^\//, '')}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const authToken = token || localStorage.getItem('atlas_token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      headers['X-Atlas-Token'] = authToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson.detail || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();

    return {
      isConnected: true,
      data,
      error: null,
    };
  } catch (error) {
    console.warn(
      `[ATLAS API] ${endpoint} unreachable or rejected:`,
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
  // AUTHENTICATION & USER MANAGEMENT
  // --------------------------------------------------

  login: (username, password) =>
    safeFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: (token) =>
    safeFetch('/api/auth/me', { method: 'GET' }, token),

  getUsers: (token) =>
    safeFetch('/api/users', { method: 'GET' }, token),

  createUser: (userData, token) =>
    safeFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, token),


  // --------------------------------------------------
  // DRONE ACTIVATION SETUP (ADMIN ONLY)
  // --------------------------------------------------

  getDroneConfig: (token) =>
    safeFetch('/api/drone/config', { method: 'GET' }, token),

  updateDroneConfig: (configData, token) =>
    safeFetch('/api/drone/config', {
      method: 'POST',
      body: JSON.stringify(configData),
    }, token),


  // --------------------------------------------------
  // DATABOT HELP ASSISTANT
  // --------------------------------------------------

  askDatabot: (message) =>
    safeFetch('/api/databot/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),


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