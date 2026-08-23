import React, { useEffect, useState } from 'react';
import { ModuleCard } from './ModuleCard';
import apiService from '../services/apiService';

export const ModuleGrid = ({ modules }) => {
  const [backendStatuses, setBackendStatuses] = useState({});

  const loadBackendStatuses = async () => {
    try {
      const [vision, sense, core, act] = await Promise.all([
        apiService.getVisionStatus(),
        apiService.getSensorStatus(),
        apiService.getCoreStatus(),
        apiService.getActStatus(),
      ]);

      setBackendStatuses({
        vision: vision.data?.status,
        sense: sense.data?.status,
        core: core.data?.status,
        act: act.data?.status,
      });
    } catch (error) {
      console.warn('[ATLAS] Could not load module statuses:', error);
    }
  };

  useEffect(() => {
    // Load immediately
    loadBackendStatuses();

    // Refresh dashboard status every 2 seconds
    const interval = setInterval(loadBackendStatuses, 2000);

    return () => clearInterval(interval);
  }, []);

  const updatedModules = modules.map((mod) => {
    const moduleId = String(mod.id || '').toLowerCase();

    const backendStatus = backendStatuses[moduleId];

    if (!backendStatus) {
      return mod;
    }

    return {
      ...mod,
      status: backendStatus,
      stateSummary: backendStatus,
    };
  });

  return (
    <section className="module-grid-section">
      <div className="section-header-sm">
        <span className="section-title">
          Core Operating Modules
        </span>

        <span
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          SYSTEM MATRIX STATUS: LIVE
        </span>
      </div>

      <div className="module-grid">
        {updatedModules.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
          />
        ))}
      </div>
    </section>
  );
};