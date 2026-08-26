import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const UserManagementPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.getUsers();
      if (res.isConnected && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('[USER MANAGEMENT] Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!username || !password || !name) {
      setErrorMsg('Please fill out all user fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await apiService.createUser({
        username,
        name,
        password,
        role
      });

      if (res.isConnected && res.data) {
        setSuccessMsg(`User '${username}' created successfully with role ${role}.`);
        setUsername('');
        setName('');
        setPassword('');
        setRole('USER');
        await loadUsers();
      } else {
        setErrorMsg(res.error || 'Failed to create user.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error creating user.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '80vh', padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #fee2e2', borderRadius: '12px', padding: '40px 20px', background: '#fff5f5' }}>
          <Lock size={48} style={{ color: '#dc2626', marginBottom: '15px' }} />
          <h2 style={{ margin: '0 0 10px', color: '#991b1b' }}>ACCESS RESTRICTED</h2>
          <p style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.6' }}>
            User Management is an Admin-only security feature. Normal users are not authorized to view or configure authorized system credentials.
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
              USER MANAGEMENT
            </h1>
            <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
              ADMIN SECURITY
            </span>
          </div>

          <p style={{ marginTop: '7px', color: '#6b7280', fontSize: '15px' }}>
            Configure authorized users, family members, and admin access roles for ATLAS.
          </p>
        </div>

        {/* ADD USER FORM */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '30px',
            background: '#ffffff',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} /> Add Authorized User
          </h2>

          {errorMsg && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '6px', fontSize: '13px' }}>
              ⚠ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleAddUser}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sarah_friend"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set password"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Access Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', background: '#ffffff' }}
                >
                  <option value="USER">USER (Family / Friend - View Status & Live)</option>
                  <option value="ADMIN">ADMIN (System Owner - Full Controls)</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: '#111827',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '11px 22px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'ADDING USER...' : 'ADD AUTHORIZED USER'}
              </button>
            </div>
          </form>
        </div>

        {/* REGISTERED USERS LIST */}
        <div
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '24px',
            background: '#ffffff',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> Authorized System Users ({users.length})
          </h2>

          {loading ? (
            <div style={{ color: '#6b7280', padding: '20px 0' }}>Loading user list...</div>
          ) : (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#4b5563',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <div>USERNAME</div>
                <div>FULL NAME</div>
                <div>ROLE</div>
                <div>CREATED AT</div>
              </div>

              {users.map((u, idx) => (
                <div
                  key={u.id || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.5fr 1fr 1.2fr',
                    padding: '14px 16px',
                    borderBottom: idx !== users.length - 1 ? '1px solid #e5e7eb' : 'none',
                    alignItems: 'center',
                    fontSize: '14px',
                  }}
                >
                  <strong style={{ color: '#111827' }}>{u.username}</strong>
                  <div style={{ color: '#374151' }}>{u.name}</div>
                  <div>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: u.role === 'ADMIN' ? '#fef3c7' : '#e0f2fe',
                        color: u.role === 'ADMIN' ? '#92400e' : '#0369a1',
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>
                    {u.created_at ? u.created_at.substring(0, 10) : 'System Account'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserManagementPage;
