export const visionFeedMetadata = {
  cameraId: 'CAM-07 // SECTOR 7 NORTH',
  location: 'Perimeter Wall Gate B',
  status: 'LIVE STREAM',
  resolution: '3840x2160 @ 60FPS',
  bandwidth: '18.4 Mbps',
  aiEngine: 'ATLAS Vision v4.2 Neural Net',
  activeTargetsCount: 3
};

export const detectedTargetsData = [
  {
    id: 'ATLAS-P001',
    category: 'HUMAN / PERSONNEL',
    status: 'KNOWN (STAFF)',
    statusClass: 'status-online',
    obsCount: 142,
    firstObserved: '10:30:12 UTC',
    lastObserved: 'Just now',
    expressionEstimate: 'NEUTRAL / FOCUSED',
    confidenceScore: '99.4%',
    hazardRating: 'NONE (0.02)',
    hazardClass: 'status-online',
    coordinates: 'X: 428.4 | Y: 192.1 | Z: 1.8m',
    distance: '14.2 meters',
    velocity: '1.2 m/s (Walking North)',
    notes: 'Authorized personnel tag matched badge #8492. Protocol nominal.'
  },
  {
    id: 'ATLAS-P002',
    category: 'HUMAN / UNCLASSIFIED',
    status: 'NEWLY OBSERVED',
    statusClass: 'status-evaluating',
    obsCount: 18,
    firstObserved: '10:50:54 UTC',
    lastObserved: '1s ago',
    expressionEstimate: 'CALM / ALERT',
    confidenceScore: '94.8%',
    hazardRating: 'LOW (0.12)',
    hazardClass: 'status-evaluating',
    coordinates: 'X: 512.0 | Y: 280.6 | Z: 1.7m',
    distance: '22.8 meters',
    velocity: '1.4 m/s (Approaching Line B)',
    notes: 'Awaiting secondary badge verification from ATLAS Core.'
  },
  {
    id: 'ATLAS-V003',
    category: 'VEHICLE / AUTONOMOUS ROVER',
    status: 'KNOWN (PATROL)',
    statusClass: 'status-active',
    obsCount: 480,
    firstObserved: '08:00:00 UTC',
    lastObserved: 'Just now',
    expressionEstimate: 'N/A (SYNTHETIC UNIT)',
    confidenceScore: '99.9%',
    hazardRating: 'NOMINAL (0.00)',
    hazardClass: 'status-online',
    coordinates: 'X: 620.1 | Y: 110.4 | Z: 0.5m',
    distance: '38.5 meters',
    velocity: '4.5 km/h (Perimeter Sweep)',
    notes: 'ATLAS Sentry-Alpha unit operating on scheduled route.'
  }
];

export const visionEventsData = [
  {
    id: 'VIS-9081',
    timestamp: '10:51:04 UTC',
    eventType: 'TARGET_TRACKING_LOCKED',
    targetId: 'ATLAS-P002',
    status: 'TRACKING',
    details: 'Optical lock confirmed for unclassified target in Sector 7 perimeter.'
  },
  {
    id: 'VIS-9080',
    timestamp: '10:50:54 UTC',
    eventType: 'PERSON_ENTERED_ZONE',
    targetId: 'ATLAS-P002',
    status: 'NEWLY OBSERVED',
    details: 'New human motion vector detected crossing perimeter boundary B.'
  },
  {
    id: 'VIS-9075',
    timestamp: '10:48:10 UTC',
    eventType: 'FACIAL_FEATURE_CLASSIFIED',
    targetId: 'ATLAS-P001',
    status: 'VERIFIED',
    details: 'Synthetic descriptor vector matched staff clearance profile #8492.'
  },
  {
    id: 'VIS-9060',
    timestamp: '10:30:12 UTC',
    eventType: 'PERSON_ENTERED_ZONE',
    targetId: 'ATLAS-P001',
    status: 'LOGGED',
    details: 'Initial optical detection logged at Main Entrance Sector 7.'
  },
  {
    id: 'VIS-9001',
    timestamp: '08:00:00 UTC',
    eventType: 'PATROL_UNIT_DEPLOYED',
    targetId: 'ATLAS-V003',
    status: 'ACTIVE',
    details: 'Autonomous rover Sentry-Alpha optical beacon verified.'
  }
];
