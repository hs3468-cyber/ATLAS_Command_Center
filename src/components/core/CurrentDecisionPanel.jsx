import React from 'react';
import { ArrowRight, Brain, Zap, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const CurrentDecisionPanel = ({ currentDecision }) => {
  const flowSteps = [
    {
      stage: 'INPUT RECEIVED',
      value: `"${currentDecision.inputReceived}"`,
      subtext: 'Optical & Sensor Matrix',
      color: '#00f2fe'
    },
    {
      stage: 'CONTEXT',
      value: `"${currentDecision.context}"`,
      subtext: 'Multi-Modal Correlated',
      color: '#10b981'
    },
    {
      stage: 'SYSTEM ASSESSMENT',
      value: `"${currentDecision.systemAssessment}"`,
      subtext: `Risk Confidence ${currentDecision.confidenceScore}`,
      color: '#8b5cf6'
    },
    {
      stage: 'DECISION',
      value: `"${currentDecision.decision}"`,
      subtext: 'Policy Rulebook Approved',
      color: '#f59e0b'
    },
    {
      stage: 'CURRENT STATE',
      value: `"${currentDecision.currentState}"`,
      subtext: 'Mission Protocol Active',
      color: '#ef4444'
    }
  ];

  return (
    <div className="glass-panel panel-box decision-prominent-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Brain size={18} />
          Current Autonomous Decision Flow
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            TIMESTAMP: {currentDecision.timestamp}
          </span>
          <StatusBadge status="ACTIVE" />
        </div>
      </div>

      <div className="decision-flow-container">
        {flowSteps.map((step, idx) => (
          <React.Fragment key={step.stage}>
            <div 
              className="decision-flow-card"
              style={{ '--stage-color': step.color }}
            >
              <div className="flow-stage-lbl font-tech" style={{ color: step.color }}>
                {step.stage}
              </div>
              <div className="flow-stage-val font-mono">{step.value}</div>
              <div className="flow-stage-sub font-mono">{step.subtext}</div>
            </div>
            {idx < flowSteps.length - 1 && (
              <div className="flow-arrow-connector">
                <ArrowRight size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
