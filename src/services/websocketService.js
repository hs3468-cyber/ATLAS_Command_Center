/**
 * ATLAS Command Center — WebSocket Live Event Integration Service
 * Configured via VITE_WS_URL environment variable with Render production fallback.
 */

const getWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'wss://atlas-command-center-backend.onrender.com/ws/events';
  }
  return 'ws://127.0.0.1:8000/ws/events';
};

class AtlasWebSocketService {
  constructor() {
    this.wsUrl = getWsUrl();
    this.socket = null;
    this.status = 'DISCONNECTED'; // DISCONNECTED, CONNECTING, CONNECTED, OFFLINE
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectTimer = null;
  }

  isConfigured() {
    return Boolean(this.wsUrl);
  }

  getStatus() {
    return this.status;
  }

  setStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach(listener => listener(newStatus));
    }
  }

  connect() {
    if (!this.wsUrl) {
      this.setStatus('DISCONNECTED');
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    this.setStatus('CONNECTING');

    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.setStatus('CONNECTED');
        console.log('[ATLAS WebSocket] Connected to:', this.wsUrl);
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.listeners.forEach(listener => listener(payload));
        } catch (err) {
          console.warn('[ATLAS WebSocket] Failed to parse event JSON:', err.message);
        }
      };

      this.socket.onerror = (error) => {
        console.warn('[ATLAS WebSocket] Error:', error);
        this.setStatus('OFFLINE');
      };

      this.socket.onclose = () => {
        this.setStatus('DISCONNECTED');
        this.handleReconnect();
      };
    } catch (err) {
      console.warn('[ATLAS WebSocket] Connection failed:', err.message);
      this.setStatus('OFFLINE');
    }
  }

  handleReconnect() {
    if (!this.wsUrl || this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setStatus('OFFLINE');
      return;
    }

    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 5000);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.setStatus('DISCONNECTED');
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  subscribeStatus(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }
}

export const websocketService = new AtlasWebSocketService();
