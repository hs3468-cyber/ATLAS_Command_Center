import React from 'react';
import { UserCheck, ShieldAlert, Compass, Activity, Smile, FileText } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export const ObservationProfile = ({ target }) => {
  if (!target) return null;

  return (
    <div className="glass-panel panel-box profile-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <UserCheck size={18} />
          Observation Profile // {target.id}
        </h2>
        <StatusBadge status={target.status.includes('KNOWN') ? 'ONLINE' : 'EVALUATING'} />
      </div>

      <div className="profile-container">
        <div className="profile-top-banner">
          <div className="profile-id-box">
            <span className="profile-id-title font-header">{target.id}</span>
            <span className="profile-category font-tech">{target.category}</span>
          </div>

          <div className="profile-confidence-pill font-mono">
            NEURAL LOCK: {target.confidenceScore}
          </div>
        </div>

        <div className="profile-grid">
          {/* Non-sensitive Facial Expression Estimate Field */}
          <div className="profile-field-card highlight-field">
            <div className="field-title font-tech">
              <Smile size={14} />
              Facial Expression Estimate
            </div>
            <div className="field-value font-mono" style={{ color: 'var(--cyan-bright)', fontSize: '1rem', fontWeight: 'bold' }}>
              {target.expressionEstimate}
            </div>
            <div className="field-subtext">Estimated via facial keypoint landmark geometry</div>
          </div>

          {/* Hazard Assessment */}
          <div className="profile-field-card">
            <div className="field-title font-tech">
              <ShieldAlert size={14} />
              Hazard Rating
            </div>
            <div className="field-value font-mono" style={{ color: 'var(--emerald-bright)' }}>
              {target.hazardRating}
            </div>
            <div className="field-subtext">Autonomous threat scoring engine</div>
          </div>

          {/* Spatial Coordinates */}
          <div className="profile-field-card">
            <div className="field-title font-tech">
              <Compass size={14} />
              3D Spatial Position
            </div>
            <div className="field-value font-mono">{target.coordinates}</div>
            <div className="field-subtext">Distance: {target.distance}</div>
          </div>

          {/* Motion Vector */}
          <div className="profile-field-card">
            <div className="field-title font-tech">
              <Activity size={14} />
              Kinematic Motion Vector
            </div>
            <div className="field-value font-mono">{target.velocity}</div>
            <div className="field-subtext">Observation Frames: {target.obsCount}</div>
          </div>
        </div>

        {/* Tactical Notes */}
        <div className="profile-notes-box">
          <div className="notes-header font-tech">
            <FileText size={14} />
            ATLAS System Assessment Notes
          </div>
          <p className="notes-body">{target.notes}</p>
        </div>
      </div>
    </div>
  );
};
