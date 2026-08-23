export const systemStatusData = {
  status: 'ONLINE',
  systemName: 'ATLAS COMMAND CENTER',
  version: 'v4.2.0-TACTICAL',
  uptime: '99.98%',
  activeNodes: '4 / 4',
  latency: '12ms',
  threatLevel: 'NOMINAL',
  lastSync: 'LIVE STREAM'
};

export const modulesData = [
  {
    id: 'vision',
    name: 'ATLAS VISION',
    verb: 'SEE',
    status: 'ACTIVE',
    statusClass: 'status-active',
    accentColor: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.35)',
    icon: 'Eye',
    stateSummary: 'Optical feed analyzing sector 7. Target identification active.',
    telemetryLabel: 'OBJECTS DETECTED',
    telemetryValue: '3 TRACKED',
    updatedAt: '1s ago'
  },
  {
    id: 'sense',
    name: 'ATLAS SENSE',
    verb: 'SENSE',
    status: 'ACTIVE',
    statusClass: 'status-active',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    icon: 'Radio',
    stateSummary: 'Thermal & acoustic telemetry nominal. Motion signature logged at Sector 7 perimeter.',
    telemetryLabel: 'SENSOR MATRIX',
    telemetryValue: '100% ONLINE',
    updatedAt: 'Just now'
  },
  {
    id: 'core',
    name: 'ATLAS CORE',
    verb: 'THINK',
    status: 'EVALUATING',
    statusClass: 'status-evaluating',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    icon: 'Brain',
    stateSummary: 'Threat matrix score 0.12 (Low). Operational demo confidence score 98.4%.',
    telemetryLabel: 'DEMO CONFIDENCE',
    telemetryValue: '98.4%',
    updatedAt: 'Processing'
  },
  {
    id: 'act',
    name: 'ATLAS ACT',
    verb: 'ACT',
    status: 'EXECUTING',
    statusClass: 'status-executing',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    icon: 'Zap',
    stateSummary: 'Approved mission #3804 auto-dispatched. Navigational lock established.',
    telemetryLabel: 'COMMAND RESPONSE',
    telemetryValue: 'READY',
    updatedAt: 'Active'
  }
];

export const currentActivityData = {
  missionId: 'MISSION #3804 - SENTINEL PATROL',
  sector: 'Sector 7 (Perimeter North)',
  status: 'IN PROGRESS',
  progress: 68,
  assignedUnit: 'ATLAS SENTRY-ALPHA',
  parameters: {
    threatScore: '0.12 (LOW)',
    responseDelay: '140ms',
    protocol: 'AUTONOMOUS VERIFY & ESCORT'
  }
};

export const latestEventData = {
  id: 'EVT-9042',
  timestamp: '10:51:02 UTC',
  severity: 'IMPORTANT',
  sourceModule: 'ATLAS CORE',
  title: 'Autonomous Perimeter Verification Initiated',
  description: 'AI core verified non-hostile target identity and launched automated perimeter surveillance protocol for Sector 7 North.',
  actionCode: 'ACT-DISPATCH-904'
};

export const timelineEventsData = [
  {
    step: 1,
    id: 'EVT-101',
    module: 'VISION',
    moduleFullName: 'ATLAS VISION',
    event: 'Person detected',
    detail: 'Optical sensor #4 tagged motion signature in Sector 7 perimeter zone.',
    timestamp: '10:50:54 UTC',
    nodeColor: '#00f2fe',
    nodeGlow: 'rgba(0, 242, 254, 0.4)'
  },
  {
    step: 2,
    id: 'EVT-102',
    module: 'SENSE',
    moduleFullName: 'ATLAS SENSE',
    event: 'Motion/context received',
    detail: 'Acoustic and thermal sensors confirmed ground velocity of 1.4 m/s.',
    timestamp: '10:50:56 UTC',
    nodeColor: '#10b981',
    nodeGlow: 'rgba(16, 185, 129, 0.4)'
  },
  {
    step: 3,
    id: 'EVT-103',
    module: 'CORE',
    moduleFullName: 'ATLAS CORE',
    event: 'Context evaluation',
    detail: 'Evaluating historical clearance parameters & multi-layered risk model.',
    timestamp: '10:50:58 UTC',
    nodeColor: '#8b5cf6',
    nodeGlow: 'rgba(139, 92, 246, 0.4)'
  },
  {
    step: 4,
    id: 'EVT-104',
    module: 'CORE',
    moduleFullName: 'ATLAS CORE',
    event: 'Decision generated',
    detail: 'Demo confidence score: 98.4%. Action recommended: Dispatch Sentry-Alpha.',
    timestamp: '10:51:00 UTC',
    nodeColor: '#8b5cf6',
    nodeGlow: 'rgba(139, 92, 246, 0.4)'
  },
  {
    step: 5,
    id: 'EVT-105',
    module: 'ACT',
    moduleFullName: 'ATLAS ACT',
    event: 'Approved mission initiated',
    detail: 'Navigational route locked and Autonomous Recon Protocol #3804 deployed.',
    timestamp: '10:51:02 UTC',
    nodeColor: '#f59e0b',
    nodeGlow: 'rgba(245, 158, 11, 0.4)'
  }
];
