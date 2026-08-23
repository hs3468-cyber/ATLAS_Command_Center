export const actOverviewData = {
  missionId: 'MISSION #3804',
  missionName: 'SENTINEL PERIMETER PATROL',
  status: 'EXECUTING',
  assignedUnit: 'ATLAS SENTRY-ALPHA',
  progressPercent: 68,
  currentAction: 'Waypoint Navigation & Sector 7 Verification',
  dispatchTimestamp: '10:51:02 UTC'
};

export const droneStatusData = {
  unitId: 'SENTRY-ALPHA',
  unitType: 'AUTONOMOUS QUAD-ROVER v4',
  connectionStatus: 'ONLINE (100% LINK)',
  batteryLevel: 84,
  batteryTimeLeft: '28 min remaining',
  flightMode: 'AUTONOMOUS GUIDED PATROL',
  currentMission: 'MISSION #3804',
  positionCoordinates: '37.7749° N, 122.4194° W',
  rthStatus: 'RTH READY',
  rthStatusClass: 'status-online'
};

export const missionProgressStagesData = [
  { id: 'APPROVED', label: 'APPROVED', isComplete: true, isCurrent: false, time: '10:51:00 UTC' },
  { id: 'DISPATCHED', label: 'DISPATCHED', isComplete: true, isCurrent: false, time: '10:51:02 UTC' },
  { id: 'EN_ROUTE', label: 'EN ROUTE', isComplete: true, isCurrent: false, time: '10:51:05 UTC' },
  { id: 'VERIFICATION', label: 'VERIFICATION', isComplete: false, isCurrent: true, time: 'In Progress' },
  { id: 'COMPLETE', label: 'COMPLETE', isComplete: false, isCurrent: false, time: 'Pending' }
];

export const approvedActionData = {
  triggerReceived: 'ATLAS Core Verification Request #8492',
  approvedAction: 'Autonomous Dispatch Sentry-Alpha for Sector 7 Escort',
  executionStatus: 'IN PROGRESS',
  safetyApprovalStatus: 'PASSED // ZERO RISK CONFLICT',
  protocolReference: 'RULEBOOK-ACT-904',
  dispatchedBy: 'ATLAS Core Decision Engine'
};

export const droneTelemetryMetrics = [
  { label: 'Altitude', value: '12.5 m', subtext: 'Barometric / Radar Lock', accentColor: '#00f2fe' },
  { label: 'Distance from Base', value: '142 m', subtext: 'Sector 7 North Perimeter', accentColor: '#10b981' },
  { label: 'Ground Speed', value: '4.2 m/s', subtext: 'Vector Cruise Speed', accentColor: '#8b5cf6' },
  { label: 'Heading', value: '042° NE', subtext: 'Compass Vector Lock', accentColor: '#f59e0b' },
  { label: 'Battery Level', value: '84%', subtext: '28 min flight time', accentColor: '#10b981' },
  { label: 'Signal Strength', value: '-54 dBm', subtext: 'Link: EXCELLENT', accentColor: '#00f2fe' }
];

export const actMissionHistoryData = [
  {
    id: 'ACT-3804',
    time: '10:51:02 UTC',
    missionId: 'MISSION #3804',
    action: 'Dispatch Sentry-Alpha to Sector 7',
    status: 'EXECUTING',
    result: 'En route to waypoint B'
  },
  {
    id: 'ACT-3801',
    time: '10:30:15 UTC',
    missionId: 'MISSION #3801',
    action: 'Unlock Perimeter Gate 4 for Staff #8492',
    status: 'COMPLETED',
    result: 'Access granted & re-locked'
  },
  {
    id: 'ACT-3795',
    time: '09:15:00 UTC',
    missionId: 'MISSION #3795',
    action: 'Perimeter Sensor Matrix Calibration Sweep',
    status: 'COMPLETED',
    result: 'All 6 ESP32 nodes synced'
  },
  {
    id: 'ACT-3780',
    time: '08:00:00 UTC',
    missionId: 'MISSION #3780',
    action: 'Routine Morning Sector 7 Survey',
    status: 'COMPLETED',
    result: '0 breaches detected'
  }
];
