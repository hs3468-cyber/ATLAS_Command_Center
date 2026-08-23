import React from 'react';
import { Clock, Play, RotateCcw, CheckCircle, Radio } from 'lucide-react';

export const EventTimeline = ({ 
  events, 
  activeStep, 
  onSelectStep, 
  isSimulating,
  toggleSimulation,
  resetSimulation
}) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Clock size={18} />
          Real-Time Event Timeline
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isSimulating ? (
            <button className="sim-button" disabled style={{ opacity: 0.8 }}>
              <Radio size={14} className="pulse-dot" />
              <span>LIVE DEMO</span>
            </button>
          ) : (
            <button className="sim-button" onClick={toggleSimulation}>
              <Play size={14} />
              <span>RUN DEMO</span>
            </button>
          )}

          <button 
            className="sim-button" 
            onClick={resetSimulation}
            style={{ background: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'var(--text-muted)' }}
            title="Reset Simulation"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="timeline-list">
        {events.map((evt) => {
          const isCurrent = evt.step === activeStep;
          const isCompleted = activeStep > evt.step;
          const isPending = activeStep < evt.step;

          return (
            <div 
              key={evt.id} 
              className={`timeline-item ${isCurrent ? 'recent' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
              onClick={() => onSelectStep && onSelectStep(evt.step)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="timeline-node"
                style={{
                  '--node-color': evt.nodeColor,
                  '--node-glow': evt.nodeGlow
                }}
              >
                {isCompleted ? (
                  <CheckCircle size={16} style={{ color: evt.nodeColor }} />
                ) : (
                  <span>0{evt.step}</span>
                )}
              </div>

              <div className="timeline-body">
                <div className="timeline-top-meta">
                  <span 
                    className="timeline-module-tag"
                    style={{ '--node-color': evt.nodeColor }}
                  >
                    {evt.moduleFullName}
                  </span>
                  <span className="timeline-timestamp">{evt.timestamp}</span>
                </div>

                <div className="timeline-event-name">{evt.event}</div>
                <div className="timeline-detail">{evt.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
