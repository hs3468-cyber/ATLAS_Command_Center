import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { Cpu, Wifi, Thermometer, Radar, Gauge, Activity } from 'lucide-react';

export const NodeCard = ({ node }) => {
  const isMotionActive = node.motionStatus.includes('MOTION DETECTED');
  const isWarning = node.status === 'WARNING';

  return (
    <div className={`glass-panel node-card ${isWarning ? 'node-warning' : ''}`}>
      <div className="node-card-top">
        <div>
          <div className="node-id font-mono">
            <span className={`node-dot ${isMotionActive ? 'active' : ''}`}></span>
            {node.id}
          </div>
          <div className="node-name font-tech">{node.name}</div>
        </div>
        <StatusBadge status={node.status === 'ONLINE' ? 'ONLINE' : 'EXECUTING'} />
      </div>

      <div className="node-chip-badge font-mono">
        <Cpu size={12} />
        {node.chip} // {node.ipAddress}
      </div>

      <div className="node-metrics-grid">
        <div className="node-metric-box">
          <span className="node-metric-lbl font-tech">Motion Status</span>
          <span 
            className="node-metric-val font-mono"
            style={{ color: isMotionActive ? 'var(--emerald-bright)' : 'var(--text-muted)' }}
          >
            {node.motionStatus}
          </span>
        </div>

        <div className="node-metric-box">
          <span className="node-metric-lbl font-tech">Distance</span>
          <span className="node-metric-val font-mono" style={{ color: 'var(--cyan-bright)' }}>
            {node.distance}
          </span>
        </div>

        <div className="node-metric-box">
          <span className="node-metric-lbl font-tech">Temperature</span>
          <span className="node-metric-val font-mono" style={{ color: 'var(--amber-bright)' }}>
            {node.temperature}
          </span>
        </div>

        <div className="node-metric-box">
          <span className="node-metric-lbl font-tech">Load / Floor Weight</span>
          <span className="node-metric-val font-mono" style={{ color: 'var(--purple-bright)' }}>
            {node.load}
          </span>
        </div>
      </div>

      <div className="node-card-footer">
        <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          ENV: <span style={{ color: '#fff' }}>{node.environment}</span>
        </div>
        <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--emerald-bright)' }}>
          HEALTH: {node.health} ({node.updatedAt})
        </div>
      </div>
    </div>
  );
};
