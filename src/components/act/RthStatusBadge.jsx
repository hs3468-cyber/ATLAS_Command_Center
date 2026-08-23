import React from 'react';
import { Home, ShieldCheck } from 'lucide-react';

export const RthStatusBadge = ({ status = 'RTH READY' }) => {
  return (
    <div className="glass-panel rth-banner-card">
      <div className="rth-left font-tech">
        <Home size={20} style={{ color: 'var(--emerald-bright)' }} />
        <span>Return-To-Home (RTH) Failsafe</span>
      </div>

      <div className="rth-status-pill font-mono">
        <span className="rth-dot"></span>
        {status}
      </div>
    </div>
  );
};
