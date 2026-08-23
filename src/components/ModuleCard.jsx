import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Eye, Radio, Brain, Zap, Activity } from 'lucide-react';

const iconMap = {
  Eye: Eye,
  Radio: Radio,
  Brain: Brain,
  Zap: Zap,
};

export const ModuleCard = ({ module }) => {
  const IconComponent = iconMap[module.icon] || Activity;

  // Use live backend values when available
  const status = module.status || 'UNKNOWN';

  const stateSummary =
    module.stateSummary ||
    status ||
    'UNKNOWN';

  return (
    <div
      className="glass-panel module-card"
      style={{
        '--accent-color': module.accentColor,
      }}
    >
      <div className="module-card-header">
        <div>
          <div className="module-verb">
            {module.verb}
          </div>

          <h3 className="module-card-title">
            {module.name}
          </h3>
        </div>

        <div
          className="module-icon-wrap"
          style={{
            color: module.accentColor,
            boxShadow: `0 0 10px ${module.glowColor}`,
          }}
        >
          <IconComponent size={20} />
        </div>
      </div>

      <div className="module-card-body">
        <div
          className="module-state-box"
          style={{
            borderLeftColor: module.accentColor,
          }}
        >
          {stateSummary}
        </div>
      </div>

      <div className="module-card-footer">
        <div className="telemetry-tag">
          {module.telemetryLabel}:{' '}
          <span className="telemetry-val">
            {module.telemetryValue}
          </span>
        </div>

        <StatusBadge status={status} />
      </div>
    </div>
  );
};

export default ModuleCard;