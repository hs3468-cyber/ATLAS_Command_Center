import React from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { Cpu, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const ModulePlaceholderPage = ({ title, moduleName, accentColor, description }) => {
  return (
    <div className="page-content">
      <header className="header-container glass-panel">
        <div className="header-branding">
          <div className="logo-icon" style={{ borderColor: accentColor, color: accentColor }}>
            <Cpu size={24} />
          </div>
          <div className="header-title-group">
            <h1 className="font-header">{title}</h1>
            <div className="header-subtitle">
              ATLAS System Module // {moduleName}
            </div>
          </div>
        </div>

        <div className="header-right">
          <StatusBadge status="ACTIVE" />
        </div>
      </header>

      <div className="glass-panel panel-box" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div 
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.05)', 
            border: `1px solid ${accentColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: accentColor,
            boxShadow: `0 0 20px ${accentColor}40`
          }}
        >
          <Activity size={32} />
        </div>

        <h2 className="font-header" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.75rem' }}>
          {moduleName} Telemetry Feed Operational
        </h2>

        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {description}
        </p>

        <div className="font-mono" style={{ fontSize: '0.8rem', color: accentColor, background: 'rgba(0,0,0,0.4)', display: 'inline-block', padding: '0.5rem 1.25rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
          STATUS: 100% NOMINAL // STANDBY MODE ACTIVE
        </div>
      </div>
    </div>
  );
};
