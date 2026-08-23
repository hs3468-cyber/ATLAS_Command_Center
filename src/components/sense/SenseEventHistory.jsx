import React from 'react';
import { History } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const SenseEventHistory = ({ events }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <History size={18} />
          Recent Sensor Telemetry Events
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          STREAM: REALTIME ESP32 EVENT MATRIX
        </span>
      </div>

      <div className="table-responsive">
        <table className="vision-history-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>NODE ID</th>
              <th>EVENT TYPE</th>
              <th>READING / TELEMETRY VALUE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id}>
                <td className="font-mono text-muted">{evt.timestamp}</td>
                <td className="font-mono text-bright" style={{ color: 'var(--emerald-bright)' }}>
                  {evt.nodeId}
                </td>
                <td>
                  <span 
                    className="event-type-badge font-mono"
                    style={{ 
                      color: 'var(--emerald-bright)', 
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderColor: 'rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    {evt.eventType}
                  </span>
                </td>
                <td className="font-mono text-bright" style={{ fontSize: '0.85rem' }}>
                  {evt.readingValue}
                </td>
                <td>
                  <StatusBadge 
                    status={
                      evt.status === 'WARNING' ? 'EXECUTING' : 
                      evt.status === 'ACTIVE_ALERT' ? 'ACTIVE' : 'ONLINE'
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
