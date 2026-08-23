import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { 
  actOverviewData, 
  droneStatusData, 
  missionProgressStagesData, 
  approvedActionData, 
  droneTelemetryMetrics, 
  actMissionHistoryData 
} from '../mock/actData';
import { ActHeader } from '../components/act/ActHeader';
import { MissionOverviewCard } from '../components/act/MissionOverviewCard';
import { DroneStatusCard } from '../components/act/DroneStatusCard';
import { MissionProgressStages } from '../components/act/MissionProgressStages';
import { ApprovedActionPanel } from '../components/act/ApprovedActionPanel';
import { DroneTelemetryGrid } from '../components/act/DroneTelemetryGrid';
import { RthStatusBadge } from '../components/act/RthStatusBadge';
import { ActMissionHistoryTable } from '../components/act/ActMissionHistoryTable';

export const AtlasActPage = () => {
  const { activeStep, actMissionProgress } = useAtlasSimulation();

  const dynamicOverview = {
    ...actOverviewData,
    status: activeStep >= 4 ? 'EXECUTING' : 'READY',
    progressPercent: actMissionProgress,
    currentAction: activeStep >= 4 ? 'Waypoint Navigation & Sector 7 Verification' : 'Standby / Ready for Dispatch'
  };

  const dynamicStages = missionProgressStagesData.map((stage, idx) => {
    // Stage 0: Approved, Stage 1: Dispatched, Stage 2: En Route, Stage 3: Verification, Stage 4: Complete
    const stageIndex = idx + 1;
    return {
      ...stage,
      isComplete: activeStep > stageIndex,
      isCurrent: activeStep === stageIndex || (activeStep >= 4 && stageIndex === 4)
    };
  });

  return (
    <div className="page-content">
      {/* Header Bar */}
      <ActHeader overview={dynamicOverview} drone={droneStatusData} />

      {/* Return-To-Home Failsafe Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RthStatusBadge status={droneStatusData.rthStatus} />
      </div>

      {/* Top Grid: Mission Overview + Drone Status */}
      <div className="dashboard-main-grid" style={{ marginBottom: '1.75rem' }}>
        <MissionOverviewCard overview={dynamicOverview} />
        <DroneStatusCard drone={droneStatusData} />
      </div>

      {/* Prominent 5-Stage Mission Progress Lifecycle */}
      <MissionProgressStages stages={dynamicStages} />

      {/* Approved Action & Safety Status Panel */}
      <div style={{ marginBottom: '1.75rem' }}>
        <ApprovedActionPanel actionData={approvedActionData} />
      </div>

      {/* Drone Telemetry Matrix */}
      <div style={{ marginBottom: '1.75rem' }}>
        <DroneTelemetryGrid telemetry={droneTelemetryMetrics} />
      </div>

      {/* Mission & Action History Table */}
      <ActMissionHistoryTable missions={actMissionHistoryData} />
    </div>
  );
};
