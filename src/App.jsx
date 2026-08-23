import React, { useState } from 'react';
import { AtlasSimulationProvider } from './context/AtlasSimulationContext';
import { Sidebar } from './components/Sidebar';
import { MissionControlPage } from './pages/MissionControlPage';
import { VisionIntelligencePage } from './pages/VisionIntelligencePage';
import { SensorNetworkPage } from './pages/SensorNetworkPage';
import { CoreIntelligencePage } from './pages/CoreIntelligencePage';
import { AtlasActPage } from './pages/AtlasActPage';

function MainAppLayout() {
  const [activePage, setActivePage] = useState('mission-control');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'mission-control':
        return (
          <MissionControlPage
            setActivePage={setActivePage}
          />
        );

      case 'vision-intelligence':
        return <VisionIntelligencePage />;

      case 'sensor-network':
        return <SensorNetworkPage />;

      case 'core-intelligence':
        return <CoreIntelligencePage />;

      case 'atlas-act':
        return <AtlasActPage />;

      default:
        return (
          <MissionControlPage
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main className="main-layout-content">
        {renderCurrentPage()}

        <footer
          style={{
            marginTop: '2.5rem',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          ATLAS COMMAND CENTER // AUTONOMOUS OPERATIONAL SYSTEM //
          UNIFIED DISPATCH PROTOCOL v4.2
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AtlasSimulationProvider>
      <MainAppLayout />
    </AtlasSimulationProvider>
  );
}