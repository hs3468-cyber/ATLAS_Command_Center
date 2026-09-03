import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Activity,
  Battery,
  Radio,
  Target,
  Clock3,
  ShieldCheck,
  Plane,
  Signal,
  CircleDot,
} from 'lucide-react';

export const AtlasActPage = ({ setActivePage }) => {
  const { isAdmin } = useAuth();

  const [actStatus, setActStatus] = useState(null);
  const [mission, setMission] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActData = async () => {
    try {
      const [
        statusResponse,
        missionResponse,
        historyResponse,
      ] = await Promise.all([
        apiService.getActStatus(),
        apiService.getActMission(),
        apiService.getActHistory(),
      ]);

      if (
        statusResponse.isConnected &&
        statusResponse.data
      ) {
        setActStatus(statusResponse.data);
      }

      if (
        missionResponse.isConnected &&
        missionResponse.data
      ) {
        setMission(missionResponse.data);
      }

      if (
        historyResponse.isConnected &&
        Array.isArray(historyResponse.data)
      ) {
        setHistory(historyResponse.data);
      }
    } catch (error) {
      console.error(
        '[ACT] Failed to load ACT data:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActData();

    const interval = setInterval(
      loadActData,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const status =
    actStatus?.status || 'READY';

  const missionId =
    mission?.mission_id ||
    actStatus?.current_mission_id ||
    'No active mission';

  const missionName =
    mission?.name ||
    'No active mission';

  const unit =
    mission?.unit ||
    actStatus?.unit_status ||
    'STANDBY';

  const stage =
    mission?.stage ||
    'VERIFICATION';

  const progress =
    mission?.progress ?? 0;

  const executionStatus =
    mission?.execution_status ||
    'STANDBY';

  const battery =
    mission?.battery_demo_value ?? 0;

  const signal =
    mission?.signal_demo_value ?? 0;

  const telemetry =
    mission?.telemetry_summary ||
    'No telemetry available.';

  const isExecuting =
    executionStatus === 'EXECUTING';

  const statusActive =
    status === 'READY' ||
    status === 'EXECUTING';

  const statusLabel = loading
    ? 'LOADING'
    : status;

  const statusClass = statusActive
    ? 'act-status-active'
    : 'act-status-warning';

  return (
    <div className="act-page">
      <style>{`
        .act-page {
          min-height: 100vh;
          padding: 32px;
          color: #e8edf5;
          background:
            radial-gradient(circle at 20% 0%, rgba(35, 86, 140, 0.18), transparent 32%),
            radial-gradient(circle at 90% 10%, rgba(0, 180, 170, 0.10), transparent 28%),
            #071019;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          box-sizing: border-box;
        }

        .act-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .act-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.14);
        }

        .act-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .act-module-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(56, 189, 248, 0.30);
          border-radius: 12px;
          background: rgba(14, 116, 144, 0.12);
          color: #67e8f9;
        }

        .act-kicker {
          margin: 0 0 5px;
          color: #67e8f9;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .act-title {
          margin: 0;
          color: #f8fafc;
          font-size: 30px;
          font-weight: 750;
          letter-spacing: 0.5px;
        }

        .act-subtitle {
          margin: 6px 0 0;
          color: #8291a5;
          font-size: 13px;
        }

        .act-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .act-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border: 1px solid rgba(34, 197, 94, 0.22);
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.07);
          color: #86efac;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .act-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.75);
        }

        .act-admin-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid rgba(103, 232, 249, 0.25);
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.75);
          color: #c8f7ff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .act-admin-button:hover {
          border-color: rgba(103, 232, 249, 0.55);
          background: rgba(8, 47, 73, 0.70);
        }

        .act-section-label {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 13px;
          color: #91a4b9;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .act-section-label svg {
          color: #5eead4;
        }

        .act-status-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .act-stat-card {
          min-height: 116px;
          padding: 18px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 12px;
          background: linear-gradient(
            145deg,
            rgba(15, 29, 43, 0.96),
            rgba(9, 19, 29, 0.96)
          );
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
          box-sizing: border-box;
        }

        .act-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .act-stat-label {
          color: #718198;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .act-stat-icon {
          color: #6b8097;
        }

        .act-stat-value {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #f8fafc;
          font-size: 21px;
          font-weight: 750;
        }

        .act-status-active {
          color: #86efac;
        }

        .act-status-warning {
          color: #fbbf24;
        }

        .act-indicator {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 12px currentColor;
        }

        .act-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .act-card {
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 12px;
          background: rgba(10, 22, 33, 0.92);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.18);
          overflow: hidden;
        }

        .act-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 17px 19px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.11);
        }

        .act-card-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0;
          color: #dbe7f3;
          font-size: 13px;
          font-weight: 750;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .act-card-title svg {
          color: #67e8f9;
        }

        .act-card-body {
          padding: 20px;
        }

        .act-mission-id {
          margin-bottom: 4px;
          color: #67e8f9;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .act-mission-name {
          margin: 0 0 20px;
          color: #f8fafc;
          font-size: 23px;
          font-weight: 700;
        }

        .act-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .act-detail {
          padding: 13px;
          border: 1px solid rgba(148, 163, 184, 0.10);
          border-radius: 9px;
          background: rgba(15, 23, 42, 0.52);
        }

        .act-detail-label {
          margin-bottom: 6px;
          color: #718198;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .act-detail-value {
          color: #dce7f2;
          font-size: 13px;
          font-weight: 650;
          word-break: break-word;
        }

        .act-progress-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .act-progress-label {
          color: #8291a5;
          font-size: 11px;
          font-weight: 650;
        }

        .act-progress-value {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 750;
        }

        .act-progress-track {
          height: 7px;
          border-radius: 999px;
          background: #172433;
          overflow: hidden;
        }

        .act-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #0891b2,
            #22d3ee
          );
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.30);
          transition: width 0.4s ease;
        }

        .act-execution {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border: 1px solid rgba(34, 211, 238, 0.12);
          border-radius: 9px;
          background: rgba(8, 47, 73, 0.25);
        }

        .act-execution-icon {
          color: #5eead4;
          flex-shrink: 0;
        }

        .act-execution-title {
          margin: 0 0 4px;
          color: #dce7f2;
          font-size: 12px;
          font-weight: 700;
        }

        .act-execution-text {
          margin: 0;
          color: #7f91a7;
          font-size: 11px;
          line-height: 1.55;
        }

        .act-telemetry-grid {
          display: grid;
          gap: 12px;
        }

        .act-telemetry-item {
          padding: 13px;
          border: 1px solid rgba(148, 163, 184, 0.10);
          border-radius: 9px;
          background: rgba(15, 23, 42, 0.52);
        }

        .act-telemetry-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 9px;
        }

        .act-telemetry-label {
          color: #8190a5;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .act-telemetry-value {
          color: #e8f1f8;
          font-size: 14px;
          font-weight: 750;
        }

        .act-meter {
          height: 5px;
          border-radius: 999px;
          background: #182534;
          overflow: hidden;
        }

        .act-meter-fill {
          height: 100%;
          border-radius: inherit;
          background: #22d3ee;
          transition: width 0.4s ease;
        }

        .act-telemetry-summary {
          margin-top: 14px;
          padding: 14px;
          border-left: 2px solid #2dd4bf;
          background: rgba(20, 184, 166, 0.06);
        }

        .act-telemetry-summary-label {
          margin-bottom: 6px;
          color: #718198;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .act-telemetry-summary-text {
          margin: 0;
          color: #aebdcb;
          font-size: 11px;
          line-height: 1.55;
        }

        .act-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
        }

        .act-report {
          color: #8fa0b4;
          font-size: 12px;
          line-height: 1.7;
          margin: 0;
        }

        .act-report strong {
          color: #cbd8e5;
        }

        .act-history {
          padding: 0;
        }

        .act-history-item {
          display: flex;
          gap: 12px;
          padding: 14px 19px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        }

        .act-history-item:last-child {
          border-bottom: none;
        }

        .act-history-marker {
          width: 8px;
          height: 8px;
          margin-top: 5px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 8px rgba(34, 211, 238, 0.55);
          flex-shrink: 0;
        }

        .act-history-title {
          margin: 0 0 4px;
          color: #dbe7f3;
          font-size: 12px;
          font-weight: 700;
        }

        .act-history-status {
          margin: 0;
          color: #718198;
          font-size: 10px;
        }

        .act-empty {
          padding: 22px 19px;
          color: #66768a;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .act-page {
            padding: 20px;
          }

          .act-header {
            flex-direction: column;
          }

          .act-header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .act-status-grid {
            grid-template-columns: 1fr;
          }

          .act-main-grid,
          .act-bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .act-page {
            padding: 14px;
          }

          .act-title {
            font-size: 24px;
          }

          .act-details {
            grid-template-columns: 1fr;
          }

          .act-header-actions {
            align-items: flex-start;
            flex-direction: column;
          }

          .act-admin-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="act-container">

        {/* HEADER */}
        <header className="act-header">
          <div>
            <div className="act-title-row">
              <div className="act-module-icon">
                <Plane size={23} />
              </div>

              <div>
                <p className="act-kicker">
                  ATLAS / RESPONSE MODULE
                </p>

                <h1 className="act-title">
                  ACT Command Center
                </h1>

                <p className="act-subtitle">
                  Authorized response, mission execution and telemetry
                </p>
              </div>
            </div>
          </div>

          <div className="act-header-actions">
            <div className="act-live">
              <span className="act-live-dot" />
              LIVE MONITORING
            </div>

            {isAdmin && setActivePage && (
              <button
                type="button"
                onClick={() =>
                  setActivePage('drone-setup')
                }
                className="act-admin-button"
              >
                <Settings size={15} />
                DRONE ACTIVATION SETUP
              </button>
            )}
          </div>
        </header>

        {/* STATUS */}
        <div className="act-section-label">
          <ShieldCheck size={14} />
          System Status
        </div>

        <div className="act-status-grid">

          <div className="act-stat-card">
            <div className="act-stat-top">
              <span className="act-stat-label">
                ACT STATUS
              </span>
              <Activity
                size={17}
                className="act-stat-icon"
              />
            </div>

            <div
              className={`act-stat-value ${statusClass}`}
            >
              <span className="act-indicator" />
              {statusLabel}
            </div>
          </div>

          <div className="act-stat-card">
            <div className="act-stat-top">
              <span className="act-stat-label">
                UNIT
              </span>
              <Target
                size={17}
                className="act-stat-icon"
              />
            </div>

            <div className="act-stat-value">
              {unit}
            </div>
          </div>

          <div className="act-stat-card">
            <div className="act-stat-top">
              <span className="act-stat-label">
                EXECUTION
              </span>
              <Radio
                size={17}
                className="act-stat-icon"
              />
            </div>

            <div className="act-stat-value">
              {isExecuting
                ? 'EXECUTING'
                : executionStatus}
            </div>
          </div>

        </div>

        {/* MAIN */}
        <div className="act-main-grid">

          {/* MISSION */}
          <section className="act-card">
            <div className="act-card-header">
              <h2 className="act-card-title">
                <Target size={16} />
                Current Mission
              </h2>

              <Clock3
                size={15}
                className="act-stat-icon"
              />
            </div>

            <div className="act-card-body">

              <div className="act-mission-id">
                MISSION ID / {missionId}
              </div>

              <h3 className="act-mission-name">
                {missionName}
              </h3>

              <div className="act-details">

                <div className="act-detail">
                  <div className="act-detail-label">
                    Mission Status
                  </div>
                  <div className="act-detail-value">
                    {isExecuting
                      ? 'In Progress'
                      : executionStatus}
                  </div>
                </div>

                <div className="act-detail">
                  <div className="act-detail-label">
                    Assigned Unit
                  </div>
                  <div className="act-detail-value">
                    {unit}
                  </div>
                </div>

                <div className="act-detail">
                  <div className="act-detail-label">
                    Mission Stage
                  </div>
                  <div className="act-detail-value">
                    {stage}
                  </div>
                </div>

                <div className="act-detail">
                  <div className="act-detail-label">
                    System State
                  </div>
                  <div className="act-detail-value">
                    {status}
                  </div>
                </div>

              </div>

              <div className="act-progress-head">
                <span className="act-progress-label">
                  Mission Progress
                </span>

                <span className="act-progress-value">
                  {progress}%
                </span>
              </div>

              <div className="act-progress-track">
                <div
                  className="act-progress-fill"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, progress)
                    )}%`,
                  }}
                />
              </div>

              <div
                className="act-execution"
                style={{
                  marginTop: '18px',
                }}
              >
                <Activity
                  size={17}
                  className="act-execution-icon"
                />

                <div>
                  <p className="act-execution-title">
                    Current Action
                  </p>

                  <p className="act-execution-text">
                    {isExecuting
                      ? 'The assigned unit is executing the approved mission.'
                      : 'The ACT system is ready and waiting for an approved mission.'}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* TELEMETRY */}
          <section className="act-card">
            <div className="act-card-header">
              <h2 className="act-card-title">
                <Signal size={16} />
                Telemetry
              </h2>
            </div>

            <div className="act-card-body">

              <div className="act-telemetry-grid">

                <div className="act-telemetry-item">
                  <div className="act-telemetry-head">
                    <span className="act-telemetry-label">
                      Battery
                    </span>

                    <span className="act-telemetry-value">
                      {battery}%
                    </span>
                  </div>

                  <div className="act-meter">
                    <div
                      className="act-meter-fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, battery)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="act-telemetry-item">
                  <div className="act-telemetry-head">
                    <span className="act-telemetry-label">
                      Signal
                    </span>

                    <span className="act-telemetry-value">
                      {signal}%
                    </span>
                  </div>

                  <div className="act-meter">
                    <div
                      className="act-meter-fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, signal)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="act-telemetry-item">
                  <div className="act-telemetry-head">
                    <span className="act-telemetry-label">
                      Connection
                    </span>

                    <span className="act-telemetry-value">
                      {actStatus?.isConnected === false
                        ? 'OFFLINE'
                        : 'CONNECTED'}
                    </span>
                  </div>
                </div>

              </div>

              <div className="act-telemetry-summary">
                <div className="act-telemetry-summary-label">
                  Telemetry Summary
                </div>

                <p className="act-telemetry-summary-text">
                  {telemetry}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* BOTTOM */}
        <div className="act-bottom-grid">

          {/* REPORT */}
          <section className="act-card">
            <div className="act-card-header">
              <h2 className="act-card-title">
                <Battery size={16} />
                Current Report
              </h2>
            </div>

            <div className="act-card-body">
              <p className="act-report">
                The <strong>ACT module</strong> is connected
                to the backend and displays the current
                mission, execution state and telemetry
                information returned by the ATLAS system.
              </p>
            </div>
          </section>

          {/* HISTORY */}
          <section className="act-card">
            <div className="act-card-header">
              <h2 className="act-card-title">
                <Clock3 size={16} />
                Recent History
              </h2>

              <CircleDot
                size={14}
                className="act-stat-icon"
              />
            </div>

            <div className="act-history">

              {loading ? (
                <div className="act-empty">
                  Loading ACT history...
                </div>
              ) : history.length > 0 ? (
                history
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={
                        item.mission_id ||
                        item.id ||
                        index
                      }
                      className="act-history-item"
                    >
                      <span className="act-history-marker" />

                      <div>
                        <p className="act-history-title">
                          {item.name ||
                            item.mission_id ||
                            'Mission event'}
                        </p>

                        <p className="act-history-status">
                          {item.execution_status ||
                            item.stage ||
                            'Mission status recorded.'}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="act-empty">
                  No ACT mission history available.
                </div>
              )}

            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default AtlasActPage;