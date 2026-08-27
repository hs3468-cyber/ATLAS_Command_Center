import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Lock, AlertTriangle, Eye, Shield } from 'lucide-react';

export const PrivacyConsentPage = () => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getPrivacyPolicy()
      .then((res) => {
        if (res.isConnected && res.data) {
          setPolicy(res.data);
        } else {
          // Fallback policy snapshot
          setPolicy({
            monitoring_purpose: "Women's Safety & Authorized Emergency Monitoring",
            collected_data: [
              'Safety Alerts & Sensor Triggers',
              'Environmental Telemetry (ESP32 Motion/Load)',
              'Optical Detection Metadata (Subject Tracking Tags)',
              'System Action Audit Logs (Actor, Timestamp, Action)'
            ],
            excluded_data: [
              'Raw Biometric Storage (No face photographs or feature vectors stored)',
              'Unnecessary Personal Data',
              'Raw Video/Camera Frames (Processed in-memory only)',
              'Passwords, Tokens, or Private Auth Credentials'
            ],
            retention_policy: '30 Days (Automated Log Purge Schedule)',
            privacy_mode: 'ACTIVE',
            authorized_access: 'ADMIN / AUTHORIZED USERS',
            disclaimer: 'Software Prototype Notice: ATLAS Privacy & Audit mechanisms provide transparent data governance, traceability, and role accountability within the Command Center application. They do not constitute formal legal compliance certification or guarantee preventing out-of-band administrator misuse.'
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>

        {/* HEADER */}
        <div
          style={{
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 600, color: '#111827' }}>
              PRIVACY & CONSENT CENTER
            </h1>
            <p style={{ marginTop: '7px', color: '#6b7280', fontSize: '15px' }}>
              Transparent data governance, collection matrix, retention policy, and ethical boundaries
            </p>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={18} /> PRIVACY MODE: {policy?.privacy_mode || 'ACTIVE'}
          </div>
        </div>

        {/* MONITORING PURPOSE */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '20px',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Eye size={22} style={{ color: '#111827' }} />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
              Monitoring Purpose
            </h2>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', background: '#f9fafb', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            {policy?.monitoring_purpose || "Women's Safety & Authorized Emergency Monitoring"}
          </div>

          <p style={{ marginTop: '12px', marginBottom: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
            ATLAS is deployed specifically for real-time safety verification, hazard detection, and emergency threat response. Surveillance pipeline data is scoped strictly to active safety alerts and emergency protocols.
          </p>
        </div>

        {/* DATA MINIMIZATION MATRIX */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {/* WHAT IS COLLECTED */}
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              padding: '20px',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                Data Collected
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(policy?.collected_data || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#374151' }}>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT IS EXCLUDED */}
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              padding: '20px',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <XCircle size={20} style={{ color: '#dc2626' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                Data Excluded & Shielded
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(policy?.excluded_data || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#374151' }}>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RETENTION & GOVERNANCE */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {/* RETENTION */}
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              padding: '20px',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={20} style={{ color: '#2563eb' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                Configured Retention Policy
              </h3>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d4ed8', marginBottom: '6px' }}>
              {policy?.retention_policy || '30 Days (Automated Log Purge Schedule)'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
              Operational event history and audit records are automatically purged after the retention window to enforce minimal data exposure.
            </p>
          </div>

          {/* AUTHORIZED ACCESS */}
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              padding: '20px',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Lock size={20} style={{ color: '#d97706' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                Authorized Access
              </h3>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#b45309', marginBottom: '6px' }}>
              {policy?.authorized_access || 'ADMIN / AUTHORIZED USERS'}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>
              Administrative system controls require multi-factor authorization. USER role accounts receive read-only operational views only.
            </p>
          </div>
        </div>

        {/* ETHICAL & LEGAL PROTOTYPE DISCLAIMER */}
        <div
          style={{
            border: '1px solid #fef08a',
            background: '#fefce8',
            borderRadius: '10px',
            padding: '20px',
            color: '#854d0e',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertTriangle size={22} style={{ shrink: 0, marginTop: '2px', color: '#ca8a04' }} />
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: '#713f12' }}>
              Ethical Governance & Software Prototype Disclaimer
            </h4>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#854d0e' }}>
              {policy?.disclaimer ||
                'Software Prototype Notice: ATLAS Privacy & Audit mechanisms provide transparent data governance, traceability, and role accountability within the Command Center application. They do not constitute formal legal compliance certification or guarantee preventing out-of-band administrator misuse.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyConsentPage;
