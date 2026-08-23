import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { Radio, Wifi, Cpu, Activity } from 'lucide-react';

export const SenseHeader = ({ stats }) => {
  return (
    <header className="header-container glass-panel">
      <div className="header-branding">
        <div className="logo-icon" style={{ borderColor: 'var(--emerald-bright)', color: 'var(--emerald-bright)' }}>
          <Radio size={24} />
        </div>
        <div className="header-title-group">
          <h1 className="font-header">
            SENSOR NETWORK
          </h1>
          <div className="header-subtitle">
            ATLAS Sense Module // ESP32 Telemetry Grid Providing Environmental & Physical Context
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="metrics-strip">
          <div className="metric-item">
            <span className="metric-label">Protocol</span>
            <span className="metric-value" style={{ color: 'var(--emerald-bright)' }}>{stats.protocol}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Mesh Latency</span>
            <span className="metric-value" style={{ color: 'var(--emerald-bright)' }}>{stats.meshLatency}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Network Health</span>
            <span className="metric-value" style={{ color: 'var(--emerald-bright)' }}>{stats.overallHealth}</span>
          </div>
        </div>

        <StatusBadge status="ONLINE" />
      </div>
    </header>
  );
};
