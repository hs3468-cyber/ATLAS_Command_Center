import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { Zap, Navigation, ShieldCheck, Compass } from 'lucide-react';

export const ActHeader = ({ overview, drone }) => {
  return (
    <header className="header-container glass-panel">
      <div className="header-branding">
        <div className="logo-icon" style={{ borderColor: 'var(--amber-bright)', color: 'var(--amber-bright)' }}>
          <Zap size={24} />
        </div>
        <div className="header-title-group">
          <h1 className="font-header">
            ATLAS ACT
          </h1>
          <div className="header-subtitle">
            ATLAS Act // Approved Action & Autonomous Mission Control
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="metrics-strip">
          <div className="metric-item">
            <span className="metric-label">Active Unit</span>
            <span className="metric-value" style={{ color: 'var(--amber-bright)' }}>{drone.unitId}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Flight Mode</span>
            <span className="metric-value" style={{ color: 'var(--amber-bright)' }}>{drone.flightMode}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Current Mission</span>
            <span className="metric-value" style={{ color: 'var(--amber-bright)' }}>{overview.missionId}</span>
          </div>
        </div>

        <StatusBadge status="EXECUTING" />
      </div>
    </header>
  );
};
