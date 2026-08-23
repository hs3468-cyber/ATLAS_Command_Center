import React from 'react';
import { Navigation, Gauge, Battery, Wifi, Compass, Layers } from 'lucide-react';

const iconMap = {
  Altitude: Layers,
  'Distance from Base': Navigation,
  'Ground Speed': Gauge,
  Heading: Compass,
  'Battery Level': Battery,
  'Signal Strength': Wifi
};

export const DroneTelemetryGrid = ({ telemetry }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Navigation size={18} />
          Drone & Unit Telemetry Matrix
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--amber-bright)' }}>
          STREAM: REALTIME TELEMETRY
        </span>
      </div>

      <div className="telemetry-tiles-grid">
        {telemetry.map((tile) => {
          const IconComp = iconMap[tile.label] || Navigation;
          return (
            <div key={tile.label} className="telemetry-tile">
              <div className="tile-top">
                <span className="tile-lbl font-tech">{tile.label}</span>
                <IconComp size={16} style={{ color: tile.accentColor }} />
              </div>
              <div className="tile-val font-mono" style={{ color: tile.accentColor }}>
                {tile.value}
              </div>
              <div className="tile-sub font-mono">{tile.subtext}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
