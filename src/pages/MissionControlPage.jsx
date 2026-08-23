import React from 'react';
import { StatusBadge } from '../components/StatusBadge';
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

  const isBackendConnected =
    backendStatus === 'LIVE STREAM CONNECTED' ||
    backendStatus === 'API CONNECTED';

  const handleDemoClick = () => {
    if (isBackendConnected) {
      runLiveBackendDemo();
    } else {
      runAtlasDemo();
    }
  };

  const systemState =
    activeStep === 0
      ? 'STANDBY'
      : activeStep >= 4
        ? 'RESPONDING'
        : 'ANALYZING';

  return (
    <div className="mission-control-page page-container">

      {/* HEADER */}
      <section
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            color: '#00f2fe',
            marginBottom: '8px'
          }}
        >
          ATLAS COMMAND CENTER
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: '32px',
            letterSpacing: '0.04em'
          }}
        >
          SEE. SENSE. THINK. ACT.
        </h1>

        <p
          style={{
            margin: '10px auto 18px',
            maxWidth: '650px',
            color: '#94a3b8',
            fontSize: '14px'
          }}
        >
          One ecosystem connecting observation, sensing, intelligence
          and approved action.
        </p>

        <StatusBadge
          status={
            activeStep === 0
              ? 'ONLINE'
              : activeStep >= 4
                ? 'RESPONDING'
                : 'INVESTIGATING'
          }
          customText={`SYSTEM ${systemState}`}
        />
      </section>

      {/* SIMPLE DEMO CONTROL */}
      <section
        className="glass-panel"
        style={{
          padding: '18px',
          borderRadius: '14px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={handleDemoClick}
          disabled={isSimulating}
          style={{
            padding: '13px 24px',
            border: 'none',
            borderRadius: '9px',
            background: '#00f2fe',
            color: '#07111f',
            fontWeight: 800,
            cursor: isSimulating ? 'not-allowed' : 'pointer'
          }}
        >
          {isSimulating ? 'ATLAS IS WORKING...' : '▶ RUN ATLAS DEMO'}
        </button>

        <button
          onClick={resetSimulation}
          disabled={isSimulating}
          style={{
            padding: '13px 20px',
            borderRadius: '9px',
            background: 'rgba(255,255,255,0.05)',
            color: '#cbd5e1',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: isSimulating ? 'not-allowed' : 'pointer'
          }}
        >
          RESET
        </button>
      </section>

      {/* WHAT IS ATLAS DOING? */}
      <section
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: '18px',
            textAlign: 'center'
          }}
        >
          WHAT IS ATLAS DOING RIGHT NOW?
        </h2>

        <div
          style={{
            textAlign: 'center',
            padding: '18px',
            margin: '18px 0',
            borderRadius: '10px',
            background: 'rgba(15,23,42,0.65)'
          }}
        >
          <div
            style={{
              color: '#00f2fe',
              fontSize: '12px',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}
          >
            CURRENT ACTIVITY
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 700
            }}
          >
            {simulationStageName || 'Monitoring the environment'}
          </div>
        </div>

        {/* SIMPLE FLOW */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}
        >
          {[
            ['👁', 'VISION', 'SEE', '#00f2fe', currentModuleStates.vision],
            ['📡', 'SENSE', 'SENSE', '#10b981', currentModuleStates.sense],
            ['🧠', 'CORE', 'THINK', '#8b5cf6', currentModuleStates.core],
            ['🚁', 'ACT', 'ACT', '#f59e0b', currentModuleStates.act]
          ].map(([icon, name, role, color, module]) => (
            <div
              key={name}
              style={{
                padding: '18px 12px',
                borderRadius: '12px',
                textAlign: 'center',
                background: 'rgba(15,23,42,0.65)',
                borderTop: `3px solid ${color}`
              }}
            >
              <div style={{ fontSize: '25px' }}>{icon}</div>

              <div
                style={{
                  color,
                  fontWeight: 800,
                  marginTop: '6px'
                }}
              >
                {name}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginTop: '3px'
                }}
              >
                {role}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: '#cbd5e1',
                  marginTop: '10px'
                }}
              >
                {module?.stateSummary || 'Ready'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CURRENT UNDERSTANDING */}
      <section
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '20px'
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>
          ATLAS UNDERSTANDING
        </h2>

        <div
          style={{
            display: 'grid',
            gap: '10px'
          }}
        >
          <div
            style={{
              padding: '14px',
              borderRadius: '9px',
              background: 'rgba(15,23,42,0.65)'
            }}
          >
            <strong style={{ color: '#00f2fe' }}>
              WHAT WAS OBSERVED?
            </strong>
            <div style={{ marginTop: '5px', color: '#cbd5e1' }}>
              {currentCoreDecision.inputReceived}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '9px',
              background: 'rgba(15,23,42,0.65)'
            }}
          >
            <strong style={{ color: '#10b981' }}>
              WHAT CONTEXT WAS FOUND?
            </strong>
            <div style={{ marginTop: '5px', color: '#cbd5e1' }}>
              {currentCoreDecision.context}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '9px',
              background: 'rgba(15,23,42,0.65)'
            }}
          >
            <strong style={{ color: '#8b5cf6' }}>
              WHAT DID ATLAS DECIDE?
            </strong>
            <div
              style={{
                marginTop: '5px',
                color: '#f8fafc',
                fontWeight: 700
              }}
            >
              {currentCoreDecision.decision}
            </div>
          </div>
        </div>
      </section>

      {/* ACTION */}
      <section
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>
          CURRENT ACTION
        </h2>

        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#f59e0b',
            marginBottom: '10px'
          }}
        >
          {activeStep >= 4
            ? 'APPROVED MISSION'
            : 'NO ACTION REQUIRED YET'}
        </div>

        <div style={{ color: '#94a3b8', fontSize: '13px' }}>
          Mission progress: {actMissionProgress}%
        </div>
      </section>

      {/* EVENT TIMELINE */}
      <section
        className="glass-panel"
        style={{
          padding: '20px',
          borderRadius: '16px'
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '18px' }}>
          LIVE EVENT STORY
        </h2>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '13px'
          }}
        >
          Follow how information moves through ATLAS.
        </p>

        <EventTimeline
          events={eventsList}
          activeStep={activeStep}
        />
      </section>

    </div>
  );
};

export default MissionControlPage;