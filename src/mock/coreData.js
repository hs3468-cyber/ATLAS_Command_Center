export const coreStatusData = {
  processingStatus: 'ONLINE / OPTIMAL',
  currentState: 'RESPONDING',
  latency: '14ms',
  eventsProcessed: '14,892',
  decisionStatus: 'AUTONOMOUS DISPATCH ENABLED',
  neuralEngine: 'ATLAS Multi-Agent Core v4.2',
  activeThreads: 16
};

export const currentDecisionData = {
  inputReceived: 'Known person detected',
  context: 'Motion event confirmed',
  systemAssessment: 'Verification required',
  decision: 'Approved predefined verification mission',
  currentState: 'RESPONDING',
  confidenceScore: '98.4%',
  executionTarget: 'ATLAS Sentry-Alpha (Mission #3804)',
  timestamp: '10:51:00 UTC'
};

export const contextFusionInputsData = [
  {
    id: 'input-vision',
    source: 'ATLAS VISION',
    icon: 'Eye',
    accentColor: '#00f2fe',
    badge: 'OPTICAL FEED ACTIVE',
    summary: 'Target ATLAS-P001 (Staff #8492) identified in Sector 7 perimeter zone. Visual confidence 99.4%.'
  },
  {
    id: 'input-sense',
    source: 'ATLAS SENSE',
    icon: 'Radio',
    accentColor: '#10b981',
    badge: 'ESP32 SENSOR GRID',
    summary: 'Node SENSE-NODE-01 motion trigger confirmed @ 2.4m. Floor pressure load matrix: 72.4 kg.'
  },
  {
    id: 'input-commands',
    source: 'SYSTEM COMMANDS',
    icon: 'Terminal',
    accentColor: '#f59e0b',
    badge: 'AUTO PROTOCOL #8492',
    summary: 'Perimeter Clearance Rulebook active. Default action policy: Autonomous Verify & Escort.'
  }
];

export const systemStatesData = [
  { id: 'MONITORING', name: 'MONITORING', isActive: false, description: 'Passive surveillance & sensor polling' },
  { id: 'INVESTIGATING', name: 'INVESTIGATING', isActive: false, description: 'Multi-modal context evaluation' },
  { id: 'RESPONDING', name: 'RESPONDING', isActive: true, description: 'Active mission dispatch & lock' },
  { id: 'STANDBY', name: 'STANDBY', isActive: false, description: 'Low power background sync' }
];

export const decisionHistoryData = [
  {
    id: 'DEC-9804',
    timestamp: '10:51:00 UTC',
    inputEvent: 'Person detected (ATLAS-P001)',
    assessmentSummary: 'Perimeter line B entry requires escort protocol',
    decision: 'Approved predefined verification mission #3804',
    resultStatus: 'EXECUTING'
  },
  {
    id: 'DEC-9799',
    timestamp: '10:48:10 UTC',
    inputEvent: 'Acoustic spike @ Sector 7 East',
    assessmentSummary: 'Ambient noise delta +12dB within normal thresholds',
    decision: 'Log anomaly; maintain routine patrol schedule',
    resultStatus: 'LOGGED'
  },
  {
    id: 'DEC-9780',
    timestamp: '10:30:12 UTC',
    inputEvent: 'Badge check (Staff #8492)',
    assessmentSummary: 'Credential matches authorized personnel database',
    decision: 'Grant Sector 7 gateway access',
    resultStatus: 'GRANTED'
  },
  {
    id: 'DEC-9720',
    timestamp: '08:00:00 UTC',
    inputEvent: 'Scheduled shift start',
    assessmentSummary: 'All 4 modules operational with zero fault flags',
    decision: 'Initiate daily autonomous perimeter patrol sweep',
    resultStatus: 'COMPLETED'
  }
];
