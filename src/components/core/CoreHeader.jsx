import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { Brain, Cpu, Zap, Activity } from 'lucide-react';

export const CoreHeader = ({ statusData }) => {
  return (
    <header className="header-container glass-panel">
      <div className="header-branding">
        <div className="logo-icon" style={{ borderColor: 'var(--purple-bright)', color: 'var(--purple-bright)' }}>
          <Brain size={24} />
        </div>
        <div className="header-title-group">
          <h1 className="font-header">
            CORE INTELLIGENCE
          </h1>
          <div className="header-subtitle">
            ATLAS Core // Context Processing & Decision Coordination
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="metrics-strip">
          <div className="metric-item">
            <span className="metric-label">Neural Engine</span>
            <span className="metric-value" style={{ color: 'var(--purple-bright)' }}>{statusData.neuralEngine}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Processing Latency</span>
            <span className="metric-value" style={{ color: 'var(--purple-bright)' }}>{statusData.latency}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Processed Events</span>
            <span className="metric-value" style={{ color: 'var(--purple-bright)' }}>{statusData.eventsProcessed}</span>
          </div>
        </div>

        <StatusBadge status="ONLINE" />
      </div>
    </header>
  );
};
