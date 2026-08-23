import React from 'react';
import { Target, ShieldAlert, Cpu } from 'lucide-react';

export const CurrentActivity = ({ activity }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Target size={18} />
          Current Activity
        </h2>
        <span className="activity-badge font-mono">{activity.status}</span>
      </div>

      <div className="activity-card-content">
        <div className="activity-header-row">
          <div>
            <div className="activity-name font-tech">{activity.missionId}</div>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Assigned Zone: {activity.sector}
            </div>
          </div>
        </div>

        <div className="activity-progress-container">
          <div className="progress-labels">
            <span>Mission Telemetry Execution</span>
            <span>{activity.progress}% COMPLETE</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${activity.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="activity-stats-grid">
          <div className="act-stat-box">
            <div className="act-stat-lbl">Assigned Unit</div>
            <div className="act-stat-val">{activity.assignedUnit}</div>
          </div>
          <div className="act-stat-box">
            <div className="act-stat-lbl">Threat Level</div>
            <div className="act-stat-val" style={{ color: 'var(--emerald-bright)' }}>
              {activity.parameters.threatScore}
            </div>
          </div>
          <div className="act-stat-box">
            <div className="act-stat-lbl">Protocol</div>
            <div className="act-stat-val">{activity.parameters.protocol}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
