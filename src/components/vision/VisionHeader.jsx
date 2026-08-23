import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { Eye, Video, Scan, Camera } from 'lucide-react';

export const VisionHeader = ({ metadata }) => {
  return (
    <header className="header-container glass-panel">
      <div className="header-branding">
        <div className="logo-icon" style={{ borderColor: 'var(--cyan-bright)', color: 'var(--cyan-bright)' }}>
          <Eye size={24} />
        </div>
        <div className="header-title-group">
          <h1 className="font-header">
            VISION INTELLIGENCE
          </h1>
          <div className="header-subtitle">
            ATLAS Vision Module // Continuous Environmental Optical Processing & Threat Classification
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="metrics-strip">
          <div className="metric-item">
            <span className="metric-label">Camera Feed</span>
            <span className="metric-value">{metadata.cameraId}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Resolution</span>
            <span className="metric-value">{metadata.resolution}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Active Targets</span>
            <span className="metric-value">{metadata.activeTargetsCount} DETECTED</span>
          </div>
        </div>

        <StatusBadge status="ACTIVE" />
      </div>
    </header>
  );
};
