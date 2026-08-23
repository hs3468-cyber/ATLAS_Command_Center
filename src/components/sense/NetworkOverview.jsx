import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export const NetworkOverview = ({ stats }) => {
  return (
    <div className="network-overview-grid">
      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Total Sensor Nodes</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--cyan-bright)' }}>
            <Cpu size={20} />
          </div>
        </div>
        <div className="overview-val font-mono">{stats.totalNodes} NODES</div>
        <div className="overview-subtext">ESP32 Telemetry Grid</div>
      </div>

      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Online Nodes</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--emerald-bright)' }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--emerald-bright)' }}>
          {stats.onlineNodes} ACTIVE
        </div>
        <div className="overview-subtext">100% Mesh Synchronized</div>
      </div>

      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Warning / Offline</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--amber-bright)' }}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--amber-bright)' }}>
          {stats.warningNodes} WARNING
        </div>
        <div className="overview-subtext">Signal Attenuation Warning</div>
      </div>

      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Network Health</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--emerald-bright)' }}>
            <Activity size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--emerald-bright)' }}>
          {stats.overallHealth}
        </div>
        <div className="overview-subtext">Telemetry Packet Delivery Rate</div>
      </div>
    </div>
  );
};
