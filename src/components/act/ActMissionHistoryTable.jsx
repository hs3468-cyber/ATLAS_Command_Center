import React from 'react';
import { History } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const ActMissionHistoryTable = ({ missions }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <History size={18} />
          Action Execution & Mission History
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          STREAM: DISPATCH LOG MATRIX
        </span>
      </div>

      <div className="table-responsive">
        <table className="vision-history-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>MISSION ID</th>
              <th>ACTION DISPATCHED</th>
              <th>STATUS</th>
              <th>RESULT / TELEMETRY OUTCOME</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((m) => (
              <tr key={m.id}>
                <td className="font-mono text-muted">{m.time}</td>
                <td className="font-mono text-bright" style={{ color: 'var(--amber-bright)' }}>
                  {m.missionId}
                </td>
                <td className="font-mono text-bright">{m.action}</td>
                <td>
                  <StatusBadge 
                    status={
                      m.status === 'EXECUTING' ? 'EXECUTING' : 'ONLINE'
                    } 
                  />
                </td>
                <td className="text-muted" style={{ fontSize: '0.825rem' }}>{m.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
