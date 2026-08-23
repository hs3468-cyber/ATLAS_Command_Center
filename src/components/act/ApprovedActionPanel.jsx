import React from 'react';
import { ShieldCheck, Zap, AlertCircle, FileCheck } from 'lucide-react';

export const ApprovedActionPanel = ({ actionData }) => {
  return (
    <div className="glass-panel panel-box approved-action-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <ShieldCheck size={18} />
          Approved Action Policy & Safety Checks
        </h2>
        <span 
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--emerald-bright)',
            color: 'var(--emerald-bright)'
          }}
        >
          {actionData.safetyApprovalStatus}
        </span>
      </div>

      <div className="approved-action-grid">
        <div className="action-field-box">
          <div className="field-lbl font-tech">Trigger Received</div>
          <div className="field-val font-mono" style={{ color: 'var(--cyan-bright)' }}>
            "{actionData.triggerReceived}"
          </div>
          <div className="field-sub font-mono">Dispatched by: {actionData.dispatchedBy}</div>
        </div>

        <div className="action-field-box highlight">
          <div className="field-lbl font-tech">Approved Predefined Action</div>
          <div className="field-val font-mono" style={{ color: 'var(--amber-bright)', fontSize: '1rem', fontWeight: 'bold' }}>
            "{actionData.approvedAction}"
          </div>
          <div className="field-sub font-mono">Protocol Ref: {actionData.protocolReference}</div>
        </div>

        <div className="action-field-box">
          <div className="field-lbl font-tech">Execution Status</div>
          <div className="field-val font-mono" style={{ color: '#fff' }}>
            "{actionData.executionStatus}"
          </div>
          <div className="field-sub font-mono">Sentry Unit Command Active</div>
        </div>
      </div>
    </div>
  );
};
