import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AtlasSimulationProvider } from './context/AtlasSimulationContext';
import { Sidebar } from './components/Sidebar';
import { Databot } from './components/Databot';
import { LoginPage } from './pages/LoginPage';
import { MissionControlPage } from './pages/MissionControlPage';
import { VisionIntelligencePage } from './pages/VisionIntelligencePage';
import { SensorNetworkPage } from './pages/SensorNetworkPage';
import { CoreIntelligencePage } from './pages/CoreIntelligencePage';
import { AtlasActPage } from './pages/AtlasActPage';
import { EvidenceRecordingsPage } from './pages/EvidenceRecordingsPage';
import { DroneSetupPage } from './pages/DroneSetupPage';
import { UserManagementPage } from './pages/UserManagementPage';

function MainAppContent() {
  const { isAuthenticated, isAdmin, isUser } = useAuth();
  const [activePage, setActivePage] = useState('mission-control');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Unauthenticated -> Show Common Login Landing Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'mission-control':
        return <MissionControlPage setActivePage={setActivePage} />;

      case 'vision-intelligence':
        return <VisionIntelligencePage />;

      case 'sensor-network':
        return <SensorNetworkPage />;

      case 'core-intelligence':
        return <CoreIntelligencePage />;

      case 'atlas-act':
        return <AtlasActPage setActivePage={setActivePage} />;

      case 'evidence-recordings':
        return <EvidenceRecordingsPage setActivePage={setActivePage} />;

      case 'drone-setup':
        return isAdmin ? <DroneSetupPage /> : <MissionControlPage setActivePage={setActivePage} />;

      case 'user-management':
        return isAdmin ? <UserManagementPage /> : <MissionControlPage setActivePage={setActivePage} />;

      default:
        return <MissionControlPage setActivePage={setActivePage} />;
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

      {/* Floating Databot Help Assistant */}
      <Databot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AtlasSimulationProvider>
        <MainAppContent />
      </AtlasSimulationProvider>
    </AuthProvider>
  );
}