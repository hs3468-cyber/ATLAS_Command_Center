import React from 'react';
import { Target, Navigation, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const MissionOverviewCard = ({ overview }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Target size={18} />
          Active Mission Overview
        </h2>
        <StatusBadge status={overview.status} />
      </div>

      <div className="activity-card-content">
        <div className="activity-header-row">
          <div>
            <div className="activity-name font-tech">{overview.missionName}</div>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--amber-bright)' }}>
              ID: {overview.missionId} // Dispatched: {overview.dispatchTimestamp}
            </div>
          </div>
        </div>

        <div className="activity-progress-container">
          <div className="progress-labels">
            <span>Autonomous Mission Execution</span>
            <span>{overview.progressPercent}% COMPLETE</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${overview.progressPercent}%`,
                background: 'linear-gradient(90deg, var(--amber-bright), var(--crimson-bright))'
              }}
            ></div>
          </div>
        </div>

        <div className="activity-stats-grid">
          <div className="act-stat-box">
            <div className="act-stat-lbl">Assigned Unit</div>
            <div className="act-stat-val" style={{ color: '#fff' }}>{overview.assignedUnit}</div>
          </div>
          <div className="act-stat-box">
            <div className="act-stat-lbl">Current Action</div>
            <div className="act-stat-val" style={{ color: 'var(--amber-bright)', fontSize: '0.775rem' }}>
              {overview.currentAction}
            </div>
          </div>
          <div className="act-stat-box">
            <div className="act-stat-lbl">Protocol Lock</div>
            <div className="act-stat-val" style={{ color: 'var(--emerald-bright)' }}>
              AUTONOMOUS ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
