import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { 
  coreStatusData, 
  contextFusionInputsData, 
  systemStatesData, 
  decisionHistoryData 
} from '../mock/coreData';
import { CoreHeader } from '../components/core/CoreHeader';
import { CoreStatusOverview } from '../components/core/CoreStatusOverview';
import { CurrentDecisionPanel } from '../components/core/CurrentDecisionPanel';
import { ContextFusionCards } from '../components/core/ContextFusionCards';
import { SystemStateMatrix } from '../components/core/SystemStateMatrix';
import { DecisionHistoryTable } from '../components/core/DecisionHistoryTable';

export const CoreIntelligencePage = () => {
  const { currentCoreDecision, currentSystemState, activeStep } = useAtlasSimulation();

  const dynamicStatusData = {
    ...coreStatusData,
    currentState: currentSystemState,
    processingStatus: activeStep >= 3 ? 'ONLINE / OPTIMAL' : 'STANDBY MODE'
  };

  const dynamicStates = systemStatesData.map((st) => ({
    ...st,
    isActive: st.id === currentSystemState
  }));

  return (
    <div className="page-content">
      {/* Header Bar */}
      <CoreHeader statusData={dynamicStatusData} />

      {/* Core Status Overview Cards */}
      <CoreStatusOverview statusData={dynamicStatusData} />

      {/* Prominent Current Decision Flow Panel (INPUT -> CONTEXT -> ASSESSMENT -> DECISION -> STATE) */}
      <div style={{ marginBottom: '1.75rem' }}>
        <CurrentDecisionPanel currentDecision={currentCoreDecision} />
      </div>

      {/* Context Fusion & System State Matrix */}
      <div className="core-mid-grid">
        <div className="fusion-col">
          <ContextFusionCards fusionInputs={contextFusionInputsData} />
        </div>
        <div className="state-col">
          <SystemStateMatrix states={dynamicStates} />
        </div>
      </div>

      {/* Decision History Log */}
      <DecisionHistoryTable decisions={decisionHistoryData} />
    </div>
  );
};
