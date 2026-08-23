import React from 'react';
import { History } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const DecisionHistoryTable = ({ decisions }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <History size={18} />
          Autonomous Decision History Log
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          OPERATOR SUMMARY VIEW // ZERO EXPOSED INNER MONOLOGUE
        </span>
      </div>

      <div className="table-responsive">
        <table className="vision-history-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>INPUT / EVENT TRIGGER</th>
              <th>ASSESSMENT SUMMARY</th>
              <th>EXECUTED DECISION</th>
              <th>RESULT / STATUS</th>
            </tr>
          </thead>
          <tbody>
            {decisions.map((dec) => (
              <tr key={dec.id}>
                <td className="font-mono text-muted">{dec.timestamp}</td>
                <td className="font-mono text-bright" style={{ color: 'var(--purple-bright)' }}>
                  {dec.inputEvent}
                </td>
                <td className="text-muted" style={{ fontSize: '0.825rem' }}>
                  {dec.assessmentSummary}
                </td>
                <td className="font-mono text-bright" style={{ fontSize: '0.85rem' }}>
                  {dec.decision}
                </td>
                <td>
                  <StatusBadge 
                    status={
                      dec.resultStatus === 'EXECUTING' ? 'EXECUTING' : 
                      dec.resultStatus === 'GRANTED' ? 'ONLINE' : 'ACTIVE'
                    } 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
