import React from 'react';
import { ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react';

export const MissionProgressStages = ({ stages }) => {
  return (
    <div className="glass-panel panel-box" style={{ marginBottom: '1.75rem' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <Clock size={18} />
          Mission Stage Execution Pipeline
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--amber-bright)' }}>
          AUTONOMOUS DISPATCH LIFECYCLE
        </span>
      </div>

      <div className="stages-track-container">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div 
              className={`stage-step-card ${stage.isCurrent ? 'current-stage' : ''} ${stage.isComplete ? 'completed-stage' : ''}`}
            >
              <div className="stage-step-top font-mono">
                {stage.isComplete ? (
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald-bright)' }} />
                ) : stage.isCurrent ? (
                  <span className="current-stage-dot"></span>
                ) : (
                  <Circle size={16} style={{ color: 'var(--text-dim)' }} />
                )}
                <span>STAGE 0{idx + 1}</span>
              </div>

              <div className="stage-step-title font-header">{stage.label}</div>
              <div className="stage-step-time font-mono">{stage.time}</div>
            </div>

            {idx < stages.length - 1 && (
              <div className={`stage-arrow ${stage.isComplete ? 'active' : ''}`}>
                <ArrowRight size={18} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
