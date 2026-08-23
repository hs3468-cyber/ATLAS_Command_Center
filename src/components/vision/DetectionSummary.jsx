import React from 'react';
import { Users, Shield, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const DetectionSummary = ({ targets, selectedTargetId, onSelectTarget }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Users size={18} />
          Detection Summary
        </h2>
        <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--cyan-bright)' }}>
          {targets.length} SUBJECTS TRACKED
        </span>
      </div>

      <div className="summary-list">
        {targets.map((target) => {
          const isSelected = target.id === selectedTargetId;
          const isKnown = target.status.includes('KNOWN');

          return (
            <div 
              key={target.id}
              className={`summary-item-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectTarget(target.id)}
            >
              <div className="summary-card-top">
                <div className="target-id-badge font-mono">
                  <span className="target-dot"></span>
                  {target.id}
                </div>
                <StatusBadge status={isKnown ? 'ONLINE' : 'EVALUATING'} />
              </div>

              <div className="target-category font-tech">{target.category}</div>

              <div className="summary-card-grid">
                <div className="sum-stat">
                  <span className="sum-lbl">Status</span>
                  <span className="sum-val font-mono">{target.status}</span>
                </div>
                <div className="sum-stat">
                  <span className="sum-lbl">Observations</span>
                  <span className="sum-val font-mono">{target.obsCount} frames</span>
                </div>
                <div className="sum-stat">
                  <span className="sum-lbl">First Observed</span>
                  <span className="sum-val font-mono">{target.firstObserved}</span>
                </div>
                <div className="sum-stat">
                  <span className="sum-lbl">Last Observed</span>
                  <span className="sum-val font-mono" style={{ color: 'var(--cyan-bright)' }}>
                    {target.lastObserved}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
