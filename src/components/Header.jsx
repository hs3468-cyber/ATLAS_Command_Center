import React, { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { Shield, Clock, Play, Server, WifiOff, Wifi } from 'lucide-react';

export const Header = ({ systemData }) => {
  const { isSimulating, simulationStageName, backendStatus } = useAtlasSimulation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTimeUTC = time.toISOString().substring(11, 19) + ' UTC';

  const renderBackendBadge = () => {
    if (backendStatus === 'LIVE STREAM CONNECTED') {
      return (
        <span 
          className="font-mono"
          style={{
            padding: '0.25rem 0.65rem',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--emerald-bright)',
            color: 'var(--emerald-bright)',
            fontSize: '0.725rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Wifi size={12} />
          LIVE STREAM CONNECTED
        </span>
      );
    }

    if (backendStatus === 'API CONNECTED') {
      return (
        <span 
          className="font-mono"
          style={{
            padding: '0.25rem 0.65rem',
            borderRadius: '4px',
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid var(--cyan-bright)',
            color: 'var(--cyan-bright)',
            fontSize: '0.725rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Server size={12} />
          API CONNECTED
        </span>
      );
    }

    if (backendStatus === 'BACKEND OFFLINE') {
      return (
        <span 
          className="font-mono"
          style={{
            padding: '0.25rem 0.65rem',
            borderRadius: '4px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--crimson-bright)',
            color: 'var(--crimson-bright)',
            fontSize: '0.725rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <WifiOff size={12} />
          BACKEND OFFLINE
        </span>
      );
    }

    // Default: DEMO MODE
    return (
      <span 
        className="font-mono"
        style={{
          padding: '0.25rem 0.65rem',
          borderRadius: '4px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: 'var(--amber-bright)',
          fontSize: '0.725rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}
      >
        <Server size={12} />
        DEMO MODE
      </span>
    );
  };

  return (
    <header className="header-container glass-panel">
      <div className="header-branding">
        <div className="logo-icon">
          <Shield size={24} />
        </div>
        <div className="header-title-group">
          <h1 className="font-header">
            ATLAS COMMAND CENTER
          </h1>
          <div className="header-subtitle">
            Autonomous Tactical Logistics & Decision Matrix // {systemData.version}
          </div>
        </div>
      </div>

      <div className="header-right">
        {isSimulating ? (
          <div 
            className="font-mono"
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              background: 'rgba(0, 242, 254, 0.15)',
              border: '1px solid var(--cyan-bright)',
              color: 'var(--cyan-bright)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Play size={12} className="pulse-dot" />
            {simulationStageName}
          </div>
        ) : (
          renderBackendBadge()
        )}

        <div className="metrics-strip">
          <div className="metric-item">
            <span className="metric-label">System Uptime</span>
            <span className="metric-value">{systemData.uptime}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Core Nodes</span>
            <span className="metric-value">{systemData.activeNodes}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Latency</span>
            <span className="metric-value">{systemData.latency}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Time Sync</span>
            <span className="metric-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {formattedTimeUTC}
            </span>
          </div>
        </div>

        <StatusBadge status={systemData.status} />
      </div>
    </header>
  );
};
