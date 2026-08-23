/**
 * Standardized ATLAS System Event Model & Helper Utilities
 */

export const createAtlasEvent = ({
  id = `EVT-${Date.now().toString().slice(-4)}`,
  timestamp = new Date().toISOString(),
  source = 'CORE',
  type = 'EVENT_LOGGED',
  message = 'System event logged',
  status = 'ACTIVE',
  data = {}
}) => {
  return {
    id,
    timestamp,
    source: ['VISION', 'SENSE', 'CORE', 'ACT'].includes(source) ? source : 'CORE',
    type,
    message,
    status: ['ACTIVE', 'COMPLETED', 'PENDING', 'ERROR'].includes(status) ? status : 'ACTIVE',
    data
  };
};

/**
 * Maps a standardized event to frontend timeline node colors
 */
export const getEventSourceStyles = (source) => {
  switch (source) {
    case 'VISION':
      return { nodeColor: '#00f2fe', nodeGlow: 'rgba(0, 242, 254, 0.4)', fullName: 'ATLAS VISION' };
    case 'SENSE':
      return { nodeColor: '#10b981', nodeGlow: 'rgba(16, 185, 129, 0.4)', fullName: 'ATLAS SENSE' };
    case 'CORE':
      return { nodeColor: '#8b5cf6', nodeGlow: 'rgba(139, 92, 246, 0.4)', fullName: 'ATLAS CORE' };
    case 'ACT':
      return { nodeColor: '#f59e0b', nodeGlow: 'rgba(245, 158, 11, 0.4)', fullName: 'ATLAS ACT' };
    default:
      return { nodeColor: '#00f2fe', nodeGlow: 'rgba(0, 242, 254, 0.4)', fullName: 'ATLAS SYSTEM' };
  }
};
