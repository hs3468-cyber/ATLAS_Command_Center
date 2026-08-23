import React from 'react';
import { NodeCard } from './NodeCard';
import { Cpu } from 'lucide-react';

export const NodeGrid = ({ nodes }) => {
  return (
    <section className="node-grid-section">
      <div className="section-header-sm">
        <span className="section-title">
          <Cpu size={16} />
          ESP32 Sensor Nodes Matrix
        </span>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--emerald-bright)' }}>
          ACTIVE MATRIX: {nodes.length} ESP32 NODES SYNCED
        </span>
      </div>

      <div className="node-grid">
        {nodes.map((node) => (
          <NodeCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
};
