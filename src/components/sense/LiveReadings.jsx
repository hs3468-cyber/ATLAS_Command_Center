import React from 'react';
import { Radar, Thermometer, Gauge, Zap, Activity } from 'lucide-react';

export const LiveReadings = ({ readings }) => {
  return (
    <div className="glass-panel panel-box live-readings-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Activity size={18} />
          Live Sensor Telemetry Monitor
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--emerald-bright)' }}>
          TRIGGER NODE: {readings.lastTriggerNode}
        </span>
      </div>

      <div className="readings-grid">
        {/* Motion Status Card */}
        <div className="reading-card">
          <div className="reading-card-top">
            <span className="reading-label font-tech">Motion & Presence</span>
            <Radar size={18} style={{ color: 'var(--emerald-bright)' }} />
          </div>
          <div className="reading-value font-mono" style={{ color: 'var(--emerald-bright)' }}>
            {readings.motionStatus}
          </div>
          <div className="reading-subtext font-mono">
            {readings.activeMotionSectors} active sectors flagged
          </div>
        </div>

        {/* Distance Sensor Card */}
        <div className="reading-card">
          <div className="reading-card-top">
            <span className="reading-label font-tech">Distance Reading</span>
            <Zap size={18} style={{ color: 'var(--cyan-bright)' }} />
          </div>
          <div className="reading-value font-mono" style={{ color: 'var(--cyan-bright)' }}>
            {readings.distance}
          </div>
          <div className="reading-subtext font-mono">
            ToF Laser / Ultrasonic Radar
          </div>
        </div>

        {/* Temperature Sensor Card */}
        <div className="reading-card">
          <div className="reading-card-top">
            <span className="reading-label font-tech">Ambient Temperature</span>
            <Thermometer size={18} style={{ color: 'var(--amber-bright)' }} />
          </div>
          <div className="reading-value font-mono" style={{ color: 'var(--amber-bright)' }}>
            {readings.temperature}
          </div>
          <div className="reading-subtext font-mono">
            Nominal Thermal Range
          </div>
        </div>

        {/* Floor Load / Weight Sensor Card */}
        <div className="reading-card">
          <div className="reading-card-top">
            <span className="reading-label font-tech">Floor Load / Weight</span>
            <Gauge size={18} style={{ color: 'var(--purple-bright)' }} />
          </div>
          <div className="reading-value font-mono" style={{ color: 'var(--purple-bright)' }}>
            {readings.pressureLoad}
          </div>
          <div className="reading-subtext font-mono">
            Ground Pressure Matrix Active
          </div>
        </div>
      </div>
    </div>
  );
};
