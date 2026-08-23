import React from 'react';

export const StatusBadge = ({ status = 'ONLINE', customClass = '' }) => {
  let badgeClass = 'status-online';
  const upperStatus = status.toUpperCase();

  if (upperStatus === 'ACTIVE') badgeClass = 'status-active';
  if (upperStatus === 'EVALUATING') badgeClass = 'status-evaluating';
  if (upperStatus === 'EXECUTING') badgeClass = 'status-executing';
  if (upperStatus === 'READY') badgeClass = 'status-ready';
  if (upperStatus === 'COMPLETE' || upperStatus === 'COMPLETED') badgeClass = 'status-complete';
  if (upperStatus === 'STANDBY') badgeClass = 'status-standby';

  return (
    <div className={`status-pill ${badgeClass} ${customClass}`}>
      <span className="status-dot"></span>
      <span>{status}</span>
    </div>
  );
};
