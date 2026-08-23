import React from 'react';
import { Cpu, Battery, Wifi, Navigation, Home } from 'lucide-react';

export const DroneStatusCard = ({ drone }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Navigation size={18} />
          Autonomous Unit Status
        </h2>
        <span 
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--emerald-bright)',
            color: 'var(--emerald-bright)'
          }}
        >
          {drone.connectionStatus}
        </span>
      </div>

      <div className="drone-status-grid">
        <div className="drone-stat-box">
          <div className="drone-stat-lbl font-tech">Unit Identifier</div>
          <div className="drone-stat-val font-mono" style={{ color: 'var(--amber-bright)' }}>
            {drone.unitId}
          </div>
          <div className="drone-stat-sub font-mono">{drone.unitType}</div>
        </div>

        <div className="drone-stat-box">
          <div className="drone-stat-lbl font-tech">Battery Power</div>
          <div className="drone-stat-val font-mono" style={{ color: 'var(--emerald-bright)' }}>
            {drone.batteryLevel}%
          </div>
          <div className="drone-stat-sub font-mono">{drone.batteryTimeLeft}</div>
        </div>

        <div className="drone-stat-box">
          <div className="drone-stat-lbl font-tech">Flight Navigation Mode</div>
          <div className="drone-stat-val font-mono" style={{ color: '#fff', fontSize: '0.8rem' }}>
            {drone.flightMode}
          </div>
          <div className="drone-stat-sub font-mono">GPS + LiDAR Waypoint Lock</div>
        </div>

        <div className="drone-stat-box">
          <div className="drone-stat-lbl font-tech">GPS Position Telemetry</div>
          <div className="drone-stat-val font-mono" style={{ color: 'var(--cyan-bright)', fontSize: '0.8rem' }}>
            {drone.positionCoordinates}
          </div>
          <div className="drone-stat-sub font-mono">Realtime RTK Accuracy</div>
        </div>
      </div>
    </div>
  );
};
