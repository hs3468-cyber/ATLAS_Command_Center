import React from 'react';
import { History, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const VisionEventHistory = ({ events }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <History size={18} />
          Vision Event History Log
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          STREAM: REALTIME OPTICAL EVENTS
        </span>
      </div>

      <div className="table-responsive">
        <table className="vision-history-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>EVENT TYPE</th>
              <th>ANONYMOUS ID</th>
              <th>STATUS</th>
              <th>OPTICAL DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id}>
                <td className="font-mono text-muted">{evt.timestamp}</td>
                <td>
                  <span className="event-type-badge font-mono">{evt.eventType}</span>
                </td>
                <td className="font-mono text-bright">{evt.targetId}</td>
                <td>
                  <StatusBadge status={evt.status.includes('KNOWN') || evt.status === 'VERIFIED' ? 'ONLINE' : 'EVALUATING'} />
                </td>
                <td className="text-muted" style={{ fontSize: '0.825rem' }}>{evt.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
