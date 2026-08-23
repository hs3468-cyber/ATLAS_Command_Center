import React, { useState } from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { 
  visionFeedMetadata, 
  detectedTargetsData, 
  visionEventsData 
} from '../mock/visionData';
import { VisionHeader } from '../components/vision/VisionHeader';
import { VisionFeed } from '../components/vision/VisionFeed';
import { DetectionSummary } from '../components/vision/DetectionSummary';
import { ObservationProfile } from '../components/vision/ObservationProfile';
import { VisionEventHistory } from '../components/vision/VisionEventHistory';

export const VisionIntelligencePage = () => {
  const { activeStep } = useAtlasSimulation();
  const [selectedTargetId, setSelectedTargetId] = useState('ATLAS-P001');

  const dynamicMetadata = {
    ...visionFeedMetadata,
    status: activeStep >= 1 ? 'LIVE STREAM' : 'STANDBY'
  };

  const selectedTarget = detectedTargetsData.find(t => t.id === selectedTargetId) || detectedTargetsData[0];

  return (
    <div className="page-content">
      {/* Header Bar */}
      <VisionHeader metadata={dynamicMetadata} />

      {/* Top Vision Section: Live Feed + Detection Summary */}
      <div className="vision-top-grid">
        <div className="feed-col">
          <VisionFeed 
            metadata={dynamicMetadata}
            targets={detectedTargetsData}
            selectedTargetId={selectedTargetId}
            onSelectTarget={setSelectedTargetId}
          />
        </div>
        <div className="summary-col">
          <DetectionSummary 
            targets={detectedTargetsData}
            selectedTargetId={selectedTargetId}
            onSelectTarget={setSelectedTargetId}
          />
        </div>
      </div>

      {/* Bottom Vision Section: Observation Profile + Vision Event History */}
      <div className="vision-bottom-grid">
        <div className="profile-col">
          <ObservationProfile target={selectedTarget} />
        </div>
        <div className="history-col">
          <VisionEventHistory events={visionEventsData} />
        </div>
      </div>
    </div>
  );
};
