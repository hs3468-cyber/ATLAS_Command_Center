import React from 'react';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';
import { 
  sensorNetworkStats, 
  liveSensorReadingsData, 
  sensorNodesData, 
  sensorEventsData 
} from '../mock/senseData';
import { SenseHeader } from '../components/sense/SenseHeader';
import { NetworkOverview } from '../components/sense/NetworkOverview';
import { LiveReadings } from '../components/sense/LiveReadings';
import { NodeGrid } from '../components/sense/NodeGrid';
import { SenseEventHistory } from '../components/sense/SenseEventHistory';

export const SensorNetworkPage = () => {
  const { activeStep } = useAtlasSimulation();

  const dynamicReadings = {
    ...liveSensorReadingsData,
    motionStatus: activeStep >= 2 ? 'MOTION DETECTED' : 'CLEAR',
    distance: activeStep >= 2 ? '2.4 meters' : '14.8 meters'
  };

  const dynamicNodes = sensorNodesData.map((node) => {
    if (node.id === 'SENSE-NODE-01') {
      return {
        ...node,
        motionStatus: activeStep >= 2 ? 'MOTION DETECTED' : 'CLEAR',
        updatedAt: activeStep >= 2 ? 'Just now' : '3s ago'
      };
    }
    return node;
  });

  return (
    <div className="page-content">
      {/* Header Bar */}
      <SenseHeader stats={sensorNetworkStats} />

      {/* Network Overview Summary Cards */}
      <NetworkOverview stats={sensorNetworkStats} />

      {/* Live Telemetry Readings Section */}
      <LiveReadings readings={dynamicReadings} />

      {/* ESP32 Sensor Nodes Grid */}
      <NodeGrid nodes={dynamicNodes} />

      {/* Sensor Event History Log */}
      <SenseEventHistory events={sensorEventsData} />
    </div>
  );
};
