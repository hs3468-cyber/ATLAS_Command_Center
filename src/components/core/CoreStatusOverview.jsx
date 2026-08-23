import React from 'react';
import { Cpu, Activity, Clock, Layers, ShieldCheck } from 'lucide-react';

export const CoreStatusOverview = ({ statusData }) => {
  return (
    <div className="network-overview-grid">
      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Processing Status</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--purple-bright)' }}>
            <Cpu size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--purple-bright)' }}>
          {statusData.processingStatus}
        </div>
        <div className="overview-subtext">Multi-Agent Thread Lock</div>
      </div>

      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Current System State</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--cyan-bright)' }}>
            <Activity size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--cyan-bright)' }}>
          {statusData.currentState}
        </div>
        <div className="overview-subtext">Active Mission Dispatch Mode</div>
      </div>

      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Processing Latency</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--emerald-bright)' }}>
            <Clock size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--emerald-bright)' }}>
          {statusData.latency}
        </div>
        <div className="overview-subtext">Realtime Context Propagation</div>
      </div>

      <div className="glass-panel overview-card">
        <div className="overview-card-header">
          <span className="overview-lbl font-tech">Events Processed</span>
          <div className="overview-icon-wrap" style={{ color: 'var(--amber-bright)' }}>
            <Layers size={20} />
          </div>
        </div>
        <div className="overview-val font-mono" style={{ color: 'var(--amber-bright)' }}>
          {statusData.eventsProcessed}
        </div>
        <div className="overview-subtext">Total System Decision Cycle</div>
      </div>
    </div>
  );
};
