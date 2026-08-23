import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export const SystemStateMatrix = ({ states }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Activity size={18} />
          System Operational State Matrix
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          AUTOMATED DISPATCH POLICY
        </span>
      </div>

      <div className="state-matrix-grid">
        {states.map((st) => (
          <div 
            key={st.id} 
            className={`state-card ${st.isActive ? 'active-state' : ''}`}
          >
            <div className="state-top">
              <span className="state-dot-indicator"></span>
              <span className="state-name font-header">{st.name}</span>
            </div>
            <div className="state-desc">{st.description}</div>
            {st.isActive && (
              <div className="active-tag-banner font-mono">
                CURRENT OPERATIONAL STATE
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
