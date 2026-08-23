/**
 * ATLAS Command Center — REST API Integration Service
 * Configured via VITE_API_BASE_URL environment variable.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic safe HTTP GET fetch wrapper
 */
async function safeFetch(endpoint, options = {}) {
  if (!API_BASE_URL) {
    return { isConnected: false, data: null, message: 'No API base URL configured (Demo Mode)' };
  }

  try {
    const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { isConnected: true, data, error: null };
  } catch (error) {
    console.warn(`[ATLAS API Service] Endpoint '${endpoint}' unreachable:`, error.message);
    return { isConnected: false, data: null, error: error.message };
  }
}

export const apiService = {
  getBaseUrl: () => API_BASE_URL,
  isConfigured: () => Boolean(API_BASE_URL),

  // System & Events
  getSystemStatus: () => safeFetch('/api/system/status'),
  getRecentEvents: (limit = 50) => safeFetch(`/api/events?limit=${limit}`),

  // Core Intelligence Module
  getCoreStatus: () => safeFetch('/api/core/status'),
  getCoreDecisions: (limit = 50) => safeFetch(`/api/core/decisions?limit=${limit}`),
  getCoreDecisionById: (decisionId) => safeFetch(`/api/core/decisions/${decisionId}`),

  // Vision Intelligence Module
  getVisionStatus: () => safeFetch('/api/vision/status'),
  getVisionDetections: () => safeFetch('/api/vision/detections'),
  getVisionDetectionById: (subjectId) => safeFetch(`/api/vision/detections/${subjectId}`),

  // Sensor Network Module
  getSensorStatus: () => safeFetch('/api/sensors/status'),
  getSensorNodes: () => safeFetch('/api/sensors/nodes'),
  getSensorNodeById: (nodeId) => safeFetch(`/api/sensors/nodes/${nodeId}`),
  getSensorEvents: (limit = 50) => safeFetch(`/api/sensors/events?limit=${limit}`),

  // ATLAS Act Module
  getActStatus: () => safeFetch('/api/act/status'),
  getActMission: () => safeFetch('/api/act/mission'),
  getActHistory: () => safeFetch('/api/act/history'),

  // Ingestion & Demo Trigger
  postEvent: (eventData) => safeFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),

  triggerDemoSequence: () => safeFetch('/api/events/demo', {
    method: 'POST',
    body: JSON.stringify({})
  })
};
