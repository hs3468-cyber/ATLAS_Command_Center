import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { FileText, ShieldAlert, Filter, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminAuditTrailPage = () => {
  const { isAdmin } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [filterActor, setFilterActor] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadAuditLogs = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiService.getAuditLogs(100, filterActor, filterAction);
      if (res.isConnected && Array.isArray(res.data)) {
        setAuditLogs(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to retrieve audit trail records.');
      }
    } catch (err) {
      console.error('[AUDIT TRAIL] Failed to load audit logs:', err);
      setErrorMsg('Access denied or backend unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [isAdmin, filterAction, filterActor]);

  if (!isAdmin) {
    return (
      <div style={{ padding: '60px 30px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: '#fef2f2', color: '#dc2626', borderRadius: '50%', marginBottom: '16px' }}>
          <ShieldAlert size={40} />
        </div>
        <h2 style={{ fontSize: '24px', color: '#111827', margin: '0 0 10px' }}>Access Forbidden</h2>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          Administrative permissions are required to inspect system audit trail records.
        </p>
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
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>

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
              ADMIN AUDIT TRAIL
            </h1>
            <p style={{ marginTop: '7px', color: '#6b7280', fontSize: '15px' }}>
              Append-only administrative action logging, traceability, and accountability records
            </p>
          </div>

          <button
            type="button"
            onClick={loadAuditLogs}
            disabled={loading}
            style={{
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> REFRESH TRAIL
          </button>
        </div>

        {/* FILTERS & SEARCH CONTROLS */}
        <div
          style={{
            padding: '16px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151', fontSize: '13px', fontWeight: 600 }}>
            <Filter size={16} /> Filter Audit Records:
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
              background: '#ffffff',
              outline: 'none',
            }}
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="CAMERA_CHANGE">CAMERA_CHANGE</option>
            <option value="DRONE_CONFIG_UPDATE">DRONE_CONFIG_UPDATE</option>
            <option value="USER_CREATE">USER_CREATE</option>
            <option value="FACE_VERIFICATION">FACE_VERIFICATION</option>
          </select>

          <input
            type="text"
            placeholder="Filter by Actor Username..."
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
              outline: 'none',
              width: '200px',
            }}
          />

          {(filterAction || filterActor) && (
            <button
              type="button"
              onClick={() => { setFilterAction(''); setFilterActor(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ERROR NOTICE */}
        {errorMsg && (
          <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            {errorMsg}
          </div>
        )}

        {/* AUDIT LOG TABLE */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px' }}>TIME (UTC)</th>
                <th style={{ padding: '12px 16px' }}>ACTOR</th>
                <th style={{ padding: '12px 16px' }}>ROLE</th>
                <th style={{ padding: '12px 16px' }}>ACTION</th>
                <th style={{ padding: '12px 16px' }}>RESOURCE</th>
                <th style={{ padding: '12px 16px' }}>RESULT</th>
                <th style={{ padding: '12px 16px' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                    Loading audit trail records...
                  </td>
                </tr>
              ) : auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#6b7280', fontSize: '12px' }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111827' }}>
                      {log.actor_username}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: log.actor_role === 'ADMIN' ? '#fef3c7' : '#e0f2fe',
                          color: log.actor_role === 'ADMIN' ? '#92400e' : '#0369a1',
                        }}
                      >
                        {log.actor_role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                      {log.resource}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: log.status === 'SUCCESS' ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: '12px' }}>
                        {log.status === 'SUCCESS' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', maxWidth: '240px', wordBreak: 'break-word' }}>
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                    No audit records match the current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminAuditTrailPage;
