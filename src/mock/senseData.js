export const sensorNetworkStats = {
  totalNodes: 6,
  onlineNodes: 5,
  warningNodes: 1,
  overallHealth: '96.8%',
  meshLatency: '10ms',
  protocol: 'ESP-NOW / MQTT Gateway v2',
  lastSync: 'LIVE STREAM'
};

export const liveSensorReadingsData = {
  activeMotionSectors: 2,
  motionStatus: 'MOTION DETECTED',
  distance: '2.4 meters',
  temperature: '24.2 °C',
  pressureLoad: '72.4 kg',
  acousticNoise: '42 dB',
  humidity: '55%',
  lastTriggerNode: 'SENSE-NODE-01'
};

export const sensorNodesData = [
  {
    id: 'SENSE-NODE-01',
    name: 'Perimeter Gate North',
    chip: 'ESP32-S3 Dual-Core',
    status: 'ONLINE',
    statusClass: 'status-online',
    motionStatus: 'MOTION DETECTED',
    motionClass: 'motion-active',
    distance: '2.4m',
    temperature: '24.2°C',
    environment: 'Acoustic 42dB',
    load: '72.4 kg',
    health: '98%',
    updatedAt: 'Just now',
    ipAddress: '192.168.4.101',
    signalStrength: '-62 dBm'
  },
  {
    id: 'SENSE-NODE-02',
    name: 'Main Gate B Perimeter',
    chip: 'ESP32-WROOM-32',
    status: 'ONLINE',
    statusClass: 'status-online',
    motionStatus: 'CLEAR',
    motionClass: 'motion-clear',
    distance: '14.8m',
    temperature: '23.8°C',
    environment: 'Humidity 55%',
    load: '0.0 kg',
    health: '99%',
    updatedAt: '1s ago',
    ipAddress: '192.168.4.102',
    signalStrength: '-58 dBm'
  },
  {
    id: 'SENSE-NODE-03',
    name: 'Sector 7 Walkway Matrix',
    chip: 'ESP32-S3 Dual-Core',
    status: 'ONLINE',
    statusClass: 'status-online',
    motionStatus: 'MOTION DETECTED',
    motionClass: 'motion-active',
    distance: '5.1m',
    temperature: '25.1°C',
    environment: 'Vibration 0.02g',
    load: '68.1 kg',
    health: '95%',
    updatedAt: 'Just now',
    ipAddress: '192.168.4.103',
    signalStrength: '-69 dBm'
  },
  {
    id: 'SENSE-NODE-04',
    name: 'North Perimeter Fence Outer',
    chip: 'ESP32-CAM (ToF Range)',
    status: 'WARNING',
    statusClass: 'status-executing',
    motionStatus: 'CLEAR',
    motionClass: 'motion-clear',
    distance: '45.0m (LIMIT)',
    temperature: '31.5°C',
    environment: 'Signal Low (-88dBm)',
    load: 'N/A',
    health: '82%',
    updatedAt: '12s ago',
    ipAddress: '192.168.4.104',
    signalStrength: '-88 dBm'
  },
  {
    id: 'SENSE-NODE-05',
    name: 'Sentry Dock Alpha Bay',
    chip: 'ESP32-S3 Dual-Core',
    status: 'ONLINE',
    statusClass: 'status-online',
    motionStatus: 'CLEAR',
    motionClass: 'motion-clear',
    distance: '1.2m',
    temperature: '22.5°C',
    environment: 'Docking Beacon Active',
    load: '120.0 kg (ROVER)',
    health: '100%',
    updatedAt: 'Just now',
    ipAddress: '192.168.4.105',
    signalStrength: '-51 dBm'
  },
  {
    id: 'SENSE-NODE-06',
    name: 'East Corridor Vault Line',
    chip: 'ESP32-WROOM-32',
    status: 'ONLINE',
    statusClass: 'status-online',
    motionStatus: 'CLEAR',
    motionClass: 'motion-clear',
    distance: '8.6m',
    temperature: '24.0°C',
    environment: 'Acoustic 38dB',
    load: '0.0 kg',
    health: '97%',
    updatedAt: '3s ago',
    ipAddress: '192.168.4.106',
    signalStrength: '-64 dBm'
  }
];

export const sensorEventsData = [
  {
    id: 'SNS-4091',
    timestamp: '10:50:56 UTC',
    nodeId: 'SENSE-NODE-01',
    eventType: 'MOTION_DETECTED',
    readingValue: 'Presence locked @ 2.4m',
    status: 'ACTIVE_ALERT'
  },
  {
    id: 'SNS-4088',
    timestamp: '10:50:55 UTC',
    nodeId: 'SENSE-NODE-01',
    eventType: 'DISTANCE_CHANGED',
    readingValue: '14.8m → 2.4m (Delta -12.4m)',
    status: 'LOGGED'
  },
  {
    id: 'SNS-4085',
    timestamp: '10:50:54 UTC',
    nodeId: 'SENSE-NODE-03',
    eventType: 'LOAD_THRESHOLD_TRIGGER',
    readingValue: 'Ground Load: 68.1 kg',
    status: 'LOGGED'
  },
  {
    id: 'SNS-4070',
    timestamp: '10:45:12 UTC',
    nodeId: 'SENSE-NODE-04',
    eventType: 'SIGNAL_DEGRADATION',
    readingValue: 'RSSI drop to -88 dBm',
    status: 'WARNING'
  },
  {
    id: 'SNS-4050',
    timestamp: '10:30:00 UTC',
    nodeId: 'SENSE-NODE-05',
    eventType: 'NODE_CONNECTED',
    readingValue: 'ESP32 Mesh Sync Handshake OK',
    status: 'ONLINE'
  },
  {
    id: 'SNS-4010',
    timestamp: '10:15:22 UTC',
    nodeId: 'SENSE-NODE-02',
    eventType: 'TEMPERATURE_UPDATED',
    readingValue: 'Ambient Temp: 23.8 °C',
    status: 'NOMINAL'
  }
];
