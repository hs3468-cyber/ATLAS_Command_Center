import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, AlertTriangle, BatteryCharging, Radio, CheckCircle, Info, Lock } from 'lucide-react';

export const DroneSetupPage = () => {
  const { isAdmin } = useAuth();
  const [config, setConfig] = useState({
    emergency_alert: true,
    unknown_intruder: true,
    theft_detection: true,
    health_emergency: false,
    operational_status: 'SIMULATED // READY',
    battery_status: 92,
    last_activation: '10:51:02 UTC'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDroneConfig();
      if (res.isConnected && res.data) {
        setConfig(res.data);
      }
    } catch (err) {
      console.error('[DRONE SETUP] Failed to load config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleToggle = async (key) => {
    const previousVal = config[key];
    const newVal = !previousVal;

    // Optimistic UI update
    setConfig(prev => ({
      ...prev,
      [key]: newVal
    }));
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      const res = await apiService.updateDroneConfig({
        [key]: newVal
      });

      if (res.isConnected && res.data) {
        setConfig(res.data);
        setSaveSuccess(true);
      } else {
        // Revert on API error
        setConfig(prev => ({
          ...prev,
          [key]: previousVal
        }));
        setErrorMsg(res.error || 'Failed to persist trigger update to backend.');
      }
    } catch (err) {
      // Revert on exception
      setConfig(prev => ({
        ...prev,
        [key]: previousVal
      }));
      setErrorMsg(err.message || 'Failed to update drone configuration.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const res = await apiService.updateDroneConfig({
        emergency_alert: config.emergency_alert,
        unknown_intruder: config.unknown_intruder,
        theft_detection: config.theft_detection,
        health_emergency: config.health_emergency
      });

      if (res.isConnected && res.data) {
        setConfig(res.data);
        setSaveSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to update drone setup configuration.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error updating configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '80vh', padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #fee2e2', borderRadius: '12px', padding: '40px 20px', background: '#fff5f5' }}>
          <Lock size={48} style={{ color: '#dc2626', marginBottom: '15px' }} />
          <h2 style={{ margin: '0 0 10px', color: '#991b1b' }}>ACCESS RESTRICTED</h2>
          <p style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.6' }}>
            Drone Activation Setup is an Admin-only configuration page. Normal user accounts are not authorized to modify operational drone parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1f2937',
        padding: '40px 30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div
          style={{
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
            marginBottom: '25px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 600, color: '#111827' }}>
              DRONE ACTIVATION SETUP
            </h1>
            <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
              ADMIN CONFIGURATION
            </span>
          </div>

          <p style={{ marginTop: '7px', color: '#6b7280', fontSize: '15px' }}>
            Configure autonomous drone response triggers, operational dispatch parameters, and safety rules.
          </p>
        </div>

        {/* SIMULATION DISCLAIMER NOTICE */}
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 18px',
            borderRadius: '8px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <Info size={20} style={{ shrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Operational Configuration Notice:</strong> Drone dispatch parameters operate in standard software demonstration mode (<code>SIMULATED TELEMETRY</code>). Configure response conditions below for automated execution during emergency events.
          </div>
        </div>

        {/* OPERATIONAL STATUS GRID */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '22px',
            marginBottom: '25px',
            background: '#ffffff',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>
            Operational Status Summary
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '18px',
            }}
          >
            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>Operational Status</div>
              <strong style={{ fontSize: '15px', color: '#111827' }}>
                {config.operational_status}
              </strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>Battery Level</div>
              <strong style={{ fontSize: '15px', color: '#16a34a' }}>
                {config.battery_status}% NOMINAL
              </strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>Live Stream Status</div>
              <strong style={{ fontSize: '15px', color: '#2563eb' }}>
                LIVE FEED STANDBY
              </strong>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>Last Activation</div>
              <strong style={{ fontSize: '15px', color: '#374151' }}>
                {config.last_activation}
              </strong>
            </div>
          </div>
        </div>

        {/* CONFIGURABLE ACTIVATION TRIGGERS */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '22px',
            marginBottom: '25px',
            background: '#ffffff',
          }}
        >
          <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 600 }}>
            Activation Triggers & Response Conditions
          </h2>
          <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: '14px' }}>
            Toggle conditions under which ATLAS will automatically trigger drone deployment and optical recording:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Trigger 1: Emergency Alert */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>Emergency Safety Alert</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  Auto-deploy drone when an emergency distress or safety signal is received.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('emergency_alert')}
                style={{
                  background: config.emergency_alert ? '#16a34a' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {config.emergency_alert ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Trigger 2: Unknown Intruder */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>Unknown Intruder Detected</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  Auto-deploy drone when Vision tags an unrecognized subject in restricted Sector 7.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('unknown_intruder')}
                style={{
                  background: config.unknown_intruder ? '#16a34a' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {config.unknown_intruder ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Trigger 3: Theft Detection */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>Theft / Forced Entry Activity</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  Auto-deploy drone when acoustic array detects forced door load or perimeter breach.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('theft_detection')}
                style={{
                  background: config.theft_detection ? '#16a34a' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {config.theft_detection ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Trigger 4: Health Emergency */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>Health Emergency Monitoring</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  Auto-deploy drone upon fall detection or sudden physical distress trigger.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('health_emergency')}
                style={{
                  background: config.health_emergency ? '#16a34a' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {config.health_emergency ? 'ON' : 'OFF'}
              </button>
            </div>

          </div>

          {/* SAVE FEEDBACK */}
          {errorMsg && (
            <div style={{ marginTop: '16px', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
              ⚠ {errorMsg}
            </div>
          )}

          {saveSuccess && (
            <div style={{ marginTop: '16px', color: '#16a34a', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Drone activation configuration saved successfully to backend.
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'SAVING CONFIGURATION...' : 'SAVE ACTIVATION SETUP'}
            </button>
          </div>
        </div>

        {/* WORKFLOW DIAGRAM */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '22px',
            background: '#ffffff',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 600 }}>
            Activation Response Workflow
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginTop: '15px',
            }}
          >
            <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>STEP 1</div>
              <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Condition Detected</strong>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Safety alert or intruder trigger</span>
            </div>

            <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>STEP 2</div>
              <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Drone Activation</strong>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Sentry-Alpha dispatches to sector</span>
            </div>

            <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>STEP 3</div>
              <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Recording & Live Feed</strong>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Optical camera streams live</span>
            </div>

            <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>STEP 4</div>
              <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>Evidence Transmitted</strong>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Clips saved for Admin review</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DroneSetupPage;
