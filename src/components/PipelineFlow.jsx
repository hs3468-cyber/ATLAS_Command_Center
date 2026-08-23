import React from 'react';
import { ArrowRight, Eye, Radio, Brain, Zap } from 'lucide-react';

export const PipelineFlow = ({ activeStep = 5 }) => {
  const steps = [
    { num: 1, name: 'VISION', action: 'SEE', icon: Eye, color: '#00f2fe' },
    { num: 2, name: 'SENSE', action: 'SENSE', icon: Radio, color: '#10b981' },
    { num: 3, name: 'CORE', action: 'THINK', icon: Brain, color: '#8b5cf6' },
    { num: 4, name: 'ACT', action: 'ACT', icon: Zap, color: '#f59e0b' }
  ];

  return (
    <section className="pipeline-section">
      <div className="section-header-sm">
        <span className="section-title">
          Operational Pipeline Architecture
        </span>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan-bright)' }}>
          DATA PROPAGATION: REALTIME
        </span>
      </div>

      <div className="glass-panel pipeline-track">
        {steps.map((step, idx) => {
          const IconComp = step.icon;
          const isActive = activeStep >= step.num;
          return (
            <React.Fragment key={step.num}>
              <div 
                className={`pipeline-step ${isActive ? 'active' : ''}`}
                style={{ '--step-color': step.color }}
              >
                <div className="step-num">{step.num}</div>
                <div className="step-content">
                  <div className="step-name">{step.name}</div>
                  <div className="step-action">{step.action}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`pipeline-connector ${isActive ? 'active' : ''}`}>
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
