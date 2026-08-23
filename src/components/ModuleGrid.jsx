import React from 'react';
import { ModuleCard } from './ModuleCard';

export const ModuleGrid = ({ modules }) => {
  return (
    <section className="module-grid-section">
      <div className="section-header-sm">
        <span className="section-title">
          Core Operating Modules
        </span>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          SYSTEM MATRIX STATUS: ALL NODES NOMINAL
        </span>
      </div>

      <div className="module-grid">
        {modules.map((mod) => (
          <ModuleCard key={mod.id} module={mod} />
        ))}
      </div>
    </section>
  );
};
