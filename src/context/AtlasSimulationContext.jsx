import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { websocketService } from '../services/websocketService';
import { createAtlasEvent, getEventSourceStyles } from '../services/eventModel';

const AtlasSimulationContext = createContext(null);

export const initialEventsList = [
  {
    step: 1,
    id: 'EVT-101',
    module: 'VISION',
    moduleFullName: 'ATLAS VISION',
    event: 'Person detected',
    detail: 'Optical sensor #4 tagged motion signature in Sector 7 perimeter zone.',
    timestamp: '10:50:54 UTC',
    nodeColor: '#00f2fe',
    nodeGlow: 'rgba(0, 242, 254, 0.4)'
  },
  {
    step: 2,
    id: 'EVT-102',
    module: 'SENSE',
    moduleFullName: 'ATLAS SENSE',
    event: 'Motion/context received',
    detail: 'Acoustic and thermal sensors confirmed ground velocity of 1.4 m/s.',
    timestamp: '10:50:56 UTC',
    nodeColor: '#10b981',
    nodeGlow: 'rgba(16, 185, 129, 0.4)'
  },
  {
    step: 3,
    id: 'EVT-103',
    module: 'CORE',
    moduleFullName: 'ATLAS CORE',
    event: 'Context evaluation',
    detail: 'Evaluating historical clearance parameters & multi-layered risk model.',
    timestamp: '10:50:58 UTC',
    nodeColor: '#8b5cf6',
    nodeGlow: 'rgba(139, 92, 246, 0.4)'
  },
  {
    step: 4,
    id: 'EVT-104',
    module: 'CORE',
    moduleFullName: 'ATLAS CORE',
    event: 'Decision generated',
    detail: 'Demo confidence score: 98.4%. Action recommended: Dispatch Sentry-Alpha.',
    timestamp: '10:51:00 UTC',
    nodeColor: '#8b5cf6',
    nodeGlow: 'rgba(139, 92, 246, 0.4)'
  },
  {
    step: 5,
    id: 'EVT-105',
    module: 'ACT',
    moduleFullName: 'ATLAS ACT',
    event: 'Approved mission initiated',
    detail: 'Navigational route locked and Autonomous Recon Protocol #3804 deployed.',
    timestamp: '10:51:02 UTC',
    nodeColor: '#f59e0b',
    nodeGlow: 'rgba(245, 158, 11, 0.4)'
  }
];

export const AtlasSimulationProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0); // 0 (STANDBY) to 5 (COMPLETE)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStageName, setSimulationStageName] = useState('STANDBY');
  
  // Backend Integration State
  const [backendStatus, setBackendStatus] = useState('DEMO MODE'); // DEMO MODE, API CONNECTED, LIVE STREAM CONNECTED, BACKEND OFFLINE
  const [eventsList, setEventsList] = useState(initialEventsList);
  const [backendCoreDecisions, setBackendCoreDecisions] = useState([]);
  
  const simulationTimerRef = useRef(null);

  // Derived Progress %
  const actMissionProgress = 
    activeStep === 0 ? 0 :
    activeStep === 1 ? 20 :
    activeStep === 2 ? 40 :
    activeStep === 3 ? 60 :
    activeStep === 4 ? 80 : 100;

  const currentSystemState = activeStep === 0 ? 'MONITORING' : activeStep >= 4 ? 'RESPONDING' : 'INVESTIGATING';

  const getModuleStatus = (moduleKey) => {
    if (activeStep === 0) {
      if (moduleKey === 'act') return 'READY';
      return 'STANDBY';
    }
    if (activeStep === 1) {
      if (moduleKey === 'vision') return 'ACTIVE';
      if (moduleKey === 'sense') return 'READY';
      if (moduleKey === 'core') return 'STANDBY';
      if (moduleKey === 'act') return 'READY';
    }
    if (activeStep === 2) {
      if (moduleKey === 'vision') return 'COMPLETE';
      if (moduleKey === 'sense') return 'ACTIVE';
      if (moduleKey === 'core') return 'STANDBY';
      if (moduleKey === 'act') return 'READY';
    }
    if (activeStep === 3 || activeStep === 4) {
      if (moduleKey === 'vision') return 'COMPLETE';
      if (moduleKey === 'sense') return 'COMPLETE';
      if (moduleKey === 'core') return 'EVALUATING';
      if (moduleKey === 'act') return 'READY';
    }
    if (activeStep >= 5) {
      if (moduleKey === 'vision') return 'COMPLETE';
      if (moduleKey === 'sense') return 'COMPLETE';
      if (moduleKey === 'core') return 'COMPLETE';
      if (moduleKey === 'act') return 'EXECUTING';
    }
    return 'STANDBY';
  };

  const currentModuleStates = {
    vision: {
      status: getModuleStatus('vision'),
      verb: 'SEE',
      stateSummary: activeStep >= 1 ? 'Person detected (ATLAS-P001) @ Sector 7 Perimeter.' : 'Optical feed standby mode.',
      telemetryValue: activeStep >= 1 ? '3 TRACKED' : '0 TRACKED'
    },
    sense: {
      status: getModuleStatus('sense'),
      verb: 'SENSE',
      stateSummary: activeStep >= 2 ? 'Motion confirmed by SENSE-NODE-01. Range: 2.4m, Load: 72.4kg.' : 'Sensor grid passive listening.',
      telemetryValue: activeStep >= 2 ? '100% ONLINE' : 'NOMINAL'
    },
    core: {
      status: getModuleStatus('core'),
      verb: 'THINK',
      stateSummary: activeStep >= 3 ? 'Threat score 0.12 (Low). Decision #3804 generated.' : 'Neural core idle.',
      telemetryValue: '98.4%'
    },
    act: {
      status: getModuleStatus('act'),
      verb: 'ACT',
      stateSummary: activeStep >= 5 ? 'Approved mission #3804 auto-dispatched to Sentry-Alpha.' : 'Actuator dispatch ready.',
      telemetryValue: activeStep >= 5 ? 'EXECUTING' : 'READY'
    }
  };

  const currentCoreDecision = {
    inputReceived: activeStep >= 1 ? 'Known person detected (ATLAS-P001)' : 'Awaiting sensor input',
    context: activeStep >= 2 ? 'Motion event confirmed @ SENSE-NODE-01 (2.4m)' : 'Evaluating background noise',
    systemAssessment: activeStep >= 3 ? 'Verification required for perimeter line B' : 'Baseline threat index nominal (0.02)',
    decision: activeStep >= 4 ? 'Approved predefined verification mission #3804' : 'Awaiting core evaluation',
    currentState: currentSystemState,
    confidenceScore: activeStep >= 3 ? '98.4%' : '99.0%',
    timestamp: new Date().toISOString().substring(11, 19) + ' UTC'
  };

  // Process Incoming Realtime WebSocket Event Payload
  const handleIncomingWsEvent = (evt) => {
    if (!evt || !evt.source) return;

    const source = evt.source.upper ? evt.source.upper() : String(evt.source).toUpperCase();
    const styles = getEventSourceStyles(source);
    
    let targetStep = 1;
    if (source === 'VISION') targetStep = 1;
    else if (source === 'SENSE') targetStep = 2;
    else if (source === 'CORE') targetStep = 4;
    else if (source === 'ACT') targetStep = 5;

    setActiveStep(targetStep);
    setSimulationStageName(`LIVE EVENT: ${source} — ${evt.message || evt.type}`);

    // Push new event into timeline list
    setEventsList(prev => {
      const exists = prev.some(item => item.id === evt.id);
      if (exists) return prev;
      return [
        {
          step: targetStep,
          id: evt.id || `EVT-${Date.now()}`,
          module: source,
          moduleFullName: styles.fullName,
          event: evt.type || evt.message || 'System Event',
          detail: evt.message || 'Event processed',
          timestamp: evt.timestamp ? evt.timestamp.substring(11, 19) + ' UTC' : new Date().toISOString().substring(11, 19) + ' UTC',
          nodeColor: styles.nodeColor,
          nodeGlow: styles.nodeGlow
        },
        ...prev
      ];
    });

    // If Core Decision Event, update Core Decision list
    if (source === 'CORE' && evt.data && evt.data.decision_id) {
      setBackendCoreDecisions(prev => [evt.data, ...prev]);
    }
  };

  // Initial Backend Data Fetch & WebSocket Subscription
  useEffect(() => {
    let isMounted = true;

    async function initializeBackend() {
      if (!apiService.isConfigured() && !websocketService.isConfigured()) {
        if (isMounted) setBackendStatus('DEMO MODE');
        return;
      }

      // Check REST API Health & Status
      const statusRes = await apiService.getSystemStatus();
      if (isMounted) {
        if (statusRes.isConnected) {
          setBackendStatus('API CONNECTED');
          
          // Load Initial Data from REST API
          const [eventsRes, coreDecRes] = await Promise.all([
            apiService.getRecentEvents(20),
            apiService.getCoreDecisions(20)
          ]);

          if (eventsRes.isConnected && Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
            const mappedEvents = eventsRes.data.map((evt, idx) => {
              const styles = getEventSourceStyles(evt.source);
              let step = 1;
              if (evt.source === 'VISION') step = 1;
              else if (evt.source === 'SENSE') step = 2;
              else if (evt.source === 'CORE') step = 4;
              else if (evt.source === 'ACT') step = 5;

              return {
                step,
                id: evt.id,
                module: evt.source,
                moduleFullName: styles.fullName,
                event: evt.type || evt.message,
                detail: evt.message,
                timestamp: evt.timestamp ? evt.timestamp.substring(11, 19) + ' UTC' : 'LIVE',
                nodeColor: styles.nodeColor,
                nodeGlow: styles.nodeGlow
              };
            });
            setEventsList(mappedEvents);
          }

          if (coreDecRes.isConnected && Array.isArray(coreDecRes.data)) {
            setBackendCoreDecisions(coreDecRes.data);
          }
        } else {
          setBackendStatus('BACKEND OFFLINE');
        }
      }
    }

    initializeBackend();

    // Connect WebSocket
    if (websocketService.isConfigured()) {
      websocketService.connect();

      const unsubStatus = websocketService.subscribeStatus((wsStatus) => {
        if (isMounted) {
          if (wsStatus === 'CONNECTED') {
            setBackendStatus('LIVE STREAM CONNECTED');
          } else if (wsStatus === 'OFFLINE') {
            setBackendStatus('BACKEND OFFLINE');
          }
        }
      });

      const unsubEvents = websocketService.subscribe((payload) => {
        if (isMounted) {
          handleIncomingWsEvent(payload);
        }
      });

      return () => {
        unsubStatus();
        unsubEvents();
        websocketService.disconnect();
      };
    }
  }, []);

  // Run Backend Live Demo (Calls POST /api/events/demo)
  const runLiveBackendDemo = async () => {
    if (isSimulating) return;

    if (backendStatus === 'LIVE STREAM CONNECTED' || backendStatus === 'API CONNECTED') {
      setIsSimulating(true);
      setActiveStep(0);
      setSimulationStageName('RUNNING LIVE BACKEND DEMO');

      const res = await apiService.triggerDemoSequence();
      if (res.isConnected && res.data) {
        setSimulationStageName('LIVE BACKEND DEMO COMPLETED');
        setActiveStep(5);
      } else {
        // Fallback to local demo if backend post fails
        runAtlasDemo();
      }
      setIsSimulating(false);
    } else {
      // Local demo fallback if backend offline
      runAtlasDemo();
    }
  };

  // Local Offline Simulation Fallback (VISION -> SENSE -> CORE -> ACT)
  const runAtlasDemo = () => {
    if (isSimulating) return;
    
    if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);

    setIsSimulating(true);
    setActiveStep(0);
    setSimulationStageName('INITIALIZING DEMO');

    simulationTimerRef.current = setTimeout(() => {
      setActiveStep(1);
      setSimulationStageName('STAGE 1: VISION — PERSON DETECTED');

      simulationTimerRef.current = setTimeout(() => {
        setActiveStep(2);
        setSimulationStageName('STAGE 2: SENSE — MOTION RECEIVED');

        simulationTimerRef.current = setTimeout(() => {
          setActiveStep(3);
          setSimulationStageName('STAGE 3: CORE — EVALUATING CONTEXT');

          simulationTimerRef.current = setTimeout(() => {
            setActiveStep(4);
            setSimulationStageName('STAGE 4: CORE — DECISION GENERATED');

            simulationTimerRef.current = setTimeout(() => {
              setActiveStep(5);
              setSimulationStageName('STAGE 5: ACT — MISSION DISPATCHED');
              setIsSimulating(false);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 800);
  };

  const resetSimulation = () => {
    if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    setIsSimulating(false);
    setActiveStep(0); // Reset Current Activity to STANDBY, 0% progress
    setSimulationStageName('STANDBY');
  };

  const setManualStep = (step) => {
    if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    setIsSimulating(false);
    setActiveStep(step);
    setSimulationStageName(`MANUAL STEP ${step}`);
  };

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    };
  }, []);

  return (
    <AtlasSimulationContext.Provider
      value={{
        activeStep,
        isSimulating,
        simulationStageName,
        currentSystemState,
        actMissionProgress,
        currentCoreDecision,
        currentModuleStates,
        eventsList,
        backendStatus,
        backendCoreDecisions,
        runLiveBackendDemo,
        runAtlasDemo,
        resetSimulation,
        setManualStep
      }}
    >
      {children}
    </AtlasSimulationContext.Provider>
  );
};

export const useAtlasSimulation = () => {
  const context = useContext(AtlasSimulationContext);
  if (!context) {
    throw new Error('useAtlasSimulation must be used within an AtlasSimulationProvider');
  }
  return context;
};
