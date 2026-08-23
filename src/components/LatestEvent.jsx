import React from 'react';
import { AlertCircle, Bell, ArrowUpRight } from 'lucide-react';

export const LatestEvent = ({ event }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Bell size={18} />
          Latest Important Event
        </h2>
        <span 
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--crimson-bright)',
            color: 'var(--crimson-bright)'
          }}
        >
          {event.severity}
        </span>
      </div>

      <div className="event-featured-box">
        <div className="featured-top">
          <div className="featured-source">
            <AlertCircle size={15} />
            SOURCE: {event.sourceModule} // {event.id}
          </div>
          <div className="featured-time">{event.timestamp}</div>
        </div>

        <h3 className="featured-title">{event.title}</h3>
        <p className="featured-desc">{event.description}</p>

        <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan-bright)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            ACTION CODE: {event.actionCode} <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};
