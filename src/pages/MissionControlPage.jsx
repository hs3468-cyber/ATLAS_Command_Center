import React from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { PipelineFlow } from '../components/PipelineFlow';
import { EventTimeline } from '../components/EventTimeline';
import { useAtlasSimulation } from '../context/AtlasSimulationContext';

export const MissionControlPage = () => {
  const {
    activeStep,
    isSimulating,
    simulationStageName,
    actMissionProgress,
    currentCoreDecision,
    currentModuleStates,
    eventsList,
    backendStatus,
    runLiveBackendDemo,
    runAtlasDemo,
    resetSimulation
  } = useAtlasSimulation();

  const isBackendConnected = backendStatus === 'LIVE STREAM CONNECTED' || backendStatus === 'API CONNECTED';

  const handleDemoClick = () => {
    if (isBackendConnected) {
      runLiveBackendDemo();
    } else {
      runAtlasDemo();
    }
  };

  return (
    <div className="mission-control-page page-container">
      {/* Dynamic Demo Control Toolbar */}
      <div className="simulation-toolbar glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', marginBottom: '20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleDemoClick}
            disabled={isSimulating}
            className="btn-demo-trigger"
            style={{
              padding: '10px 20px',
              backgroundColor: isSimulating ? 'rgba(0, 242, 254, 0.2)' : isBackendConnected ? '#10b981' : '#00f2fe',
              color: isSimulating ? '#00f2fe' : '#0a0f1d',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isSimulating ? 'none' : isBackendConnected ? '0 0 16px rgba(16, 185, 129, 0.4)' : '0 0 16px rgba(0, 242, 254, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {isSimulating ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #00f2fe', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                {isBackendConnected ? 'LIVE DEMO IN PROGRESS...' : 'SIMULATION IN PROGRESS...'}
              </>
            ) : (
              <>
                <span>▶</span> {isBackendConnected ? 'RUN LIVE ATLAS DEMO' : 'RUN ATLAS DEMO'}
              </>
            )}
          </button>

          <button
            onClick={resetSimulation}
            disabled={isSimulating}
            className="btn-demo-reset"
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#a0aec0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ↺ RESET SIMULATION
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.05em' }}>CONNECTIVITY:</span>
          <StatusBadge
            status={isBackendConnected ? 'ACTIVE' : 'READY'}
            customText={backendStatus === 'LIVE STREAM CONNECTED' ? 'LIVE STREAM CONNECTED' : backendStatus === 'API CONNECTED' ? 'REST API CONNECTED' : 'DEMO MODE // SIMULATED TELEMETRY'}
          />
        </div>
      </div>

      {/* Main Top Header */}
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '0.05em' }}>MISSION CONTROL</h1>
          <StatusBadge status={activeStep === 0 ? 'ONLINE' : activeStep >= 4 ? 'RESPONDING' : 'INVESTIGATING'} />
        </div>
        <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
          ATLAS Command Center // Autonomous Physical AI Operational Platform
        </div>
      </div>

      {/* Interactive System Pipeline Stage Indicator */}
      <PipelineFlow activeStep={activeStep} />

      {/* Grid Layout: System Activity & Decisions + Live Module Status Grid */}
      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Left Column: Live Decision Fusion Panel */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#8b5cf6', letterSpacing: '0.05em' }}>
              🧠 CORE DECISION FUSION ENGINE
            </h3>
            <StatusBadge status={activeStep === 0 ? 'READY' : activeStep >= 4 ? 'COMPLETE' : 'ACTIVE'} customText={activeStep === 0 ? 'STANDBY' : activeStep >= 4 ? 'DECISION APPROVED' : 'EVALUATING'} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #00f2fe' }}>
              <div style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 'bold' }}>INPUT RECEIVED</div>
              <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '2px' }}>{currentCoreDecision.inputReceived}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>CONTEXT FUSION</div>
              <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '2px' }}>{currentCoreDecision.context}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
              <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 'bold' }}>SYSTEM ASSESSMENT</div>
              <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '2px' }}>{currentCoreDecision.systemAssessment}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>APPROVED DECISION</div>
              <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '2px', fontWeight: 'bold' }}>{currentCoreDecision.decision}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
              <span>DEMO CONFIDENCE: <strong style={{ color: '#10b981' }}>{currentCoreDecision.confidenceScore}</strong></span>
              <span>STATE: <strong style={{ color: '#8b5cf6' }}>{currentCoreDecision.currentState}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Mission Dispatch & Autonomous Telemetry */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#f59e0b', letterSpacing: '0.05em' }}>
                🛸 AUTONOMOUS MISSION STATE
              </h3>
              <StatusBadge status={activeStep >= 5 ? 'COMPLETE' : activeStep > 0 ? 'ACTIVE' : 'READY'} customText={activeStep >= 5 ? 'EXECUTING' : activeStep > 0 ? 'PREPARING' : 'READY'} />
            </div>

            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Active Mission:</span>
                <span style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 'bold' }}>MISSION #3804 (Sentry-Alpha)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Mission Target:</span>
                <span style={{ fontSize: '12px', color: '#00f2fe' }}>Sector 7 Recon & Verification</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Return To Home (RTH):</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>ARMED // AUTO</span>
              </div>
            </div>

            {/* Mission Progress Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Mission Execution Progress:</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{actMissionProgress}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${actMissionProgress}%`,
                    backgroundColor: '#f59e0b',
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
            Current Activity: <strong style={{ color: isSimulating ? '#00f2fe' : '#f8fafc' }}>{simulationStageName}</strong>
          </div>
        </div>
      </div>

      {/* 4-Module Overview Cards Grid */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '14px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '12px' }}>
          SYSTEM ECOSYSTEM MODULES
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* VISION Card */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: '4px solid #00f2fe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00f2fe' }}>ATLAS VISION</span>
              <StatusBadge status={currentModuleStates.vision.status} />
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px', height: '36px' }}>
              {currentModuleStates.vision.stateSummary}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROLE: SEE</span>
              <strong style={{ color: '#00f2fe' }}>{currentModuleStates.vision.telemetryValue}</strong>
            </div>
          </div>

          {/* SENSE Card */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>ATLAS SENSE</span>
              <StatusBadge status={currentModuleStates.sense.status} />
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px', height: '36px' }}>
              {currentModuleStates.sense.stateSummary}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROLE: SENSE</span>
              <strong style={{ color: '#10b981' }}>{currentModuleStates.sense.telemetryValue}</strong>
            </div>
          </div>

          {/* CORE Card */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8b5cf6' }}>ATLAS CORE</span>
              <StatusBadge status={currentModuleStates.core.status} />
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px', height: '36px' }}>
              {currentModuleStates.core.stateSummary}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROLE: THINK</span>
              <strong style={{ color: '#8b5cf6' }}>CONF: {currentModuleStates.core.telemetryValue}</strong>
            </div>
          </div>

          {/* ACT Card */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }}>ATLAS ACT</span>
              <StatusBadge status={currentModuleStates.act.status} />
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px', height: '36px' }}>
              {currentModuleStates.act.stateSummary}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROLE: ACT</span>
              <strong style={{ color: '#f59e0b' }}>{currentModuleStates.act.telemetryValue}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Centralized Event Log Timeline */}
      <EventTimeline events={eventsList} activeStep={activeStep} />
    </div>
  );
};

export default MissionControlPage;
