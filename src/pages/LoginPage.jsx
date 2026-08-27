import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { FaceAuthModal } from '../components/FaceAuthModal';
import { Shield, Lock, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, completeLogin, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingAuth, setPendingAuth] = useState(null); // { user, token }

  const isFaceAuthEnabled = String(import.meta.env.VITE_ENABLE_FACE_AUTH || '').toLowerCase() === 'true';

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setErrorMsg('');
    const res = await login(username, password);
    if (res.success && res.user && res.token) {
      if (isFaceAuthEnabled) {
        // Log verification attempt
        apiService.postEvent({
          id: `EVT-AUTH-${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: 'CORE',
          type: 'FACE_VERIFICATION_ATTEMPT',
          message: `Face verification prompt presented for user: ${res.user.username}`,
          status: 'PENDING',
          data: { username: res.user.username, role: res.user.role }
        }).catch(() => {});

        // Open FaceAuthModal before completing session
        setPendingAuth({ user: res.user, token: res.token });
      } else {
        // Direct login if feature flag is false/undefined
        completeLogin(res.user, res.token);
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleFaceComplete = (meta) => {
    if (pendingAuth) {
      apiService.postEvent({
        id: `EVT-AUTH-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'CORE',
        type: 'FACE_VERIFICATION_COMPLETED',
        message: `Face verification completed successfully for user: ${pendingAuth.user.username}`,
        status: 'COMPLETED',
        data: { username: pendingAuth.user.username, role: pendingAuth.user.role, ...meta }
      }).catch(() => {});

      completeLogin(pendingAuth.user, pendingAuth.token);
      setPendingAuth(null);
    }
  };

  const handleFaceSkip = (meta) => {
    if (pendingAuth) {
      apiService.postEvent({
        id: `EVT-AUTH-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'CORE',
        type: 'FACE_VERIFICATION_SKIPPED',
        message: `Face verification skipped (credential fallback) for user: ${pendingAuth.user.username}`,
        status: 'COMPLETED',
        data: { username: pendingAuth.user.username, role: pendingAuth.user.role, ...meta }
      }).catch(() => {});

      completeLogin(pendingAuth.user, pendingAuth.token);
      setPendingAuth(null);
    }
  };

  const handleFaceCancel = () => {
    setPendingAuth(null);
  };

  const fillQuickDemo = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          padding: '40px 36px',
          background: '#ffffff',
        }}
      >
        {/* BRAND HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#111827',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Shield size={28} />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '26px',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            ATLAS
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            Intelligent Women Safety & Surveillance System
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMsg && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} style={{ shrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* COMMON LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '7px',
              }}
            >
              Username
            </label>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  display: 'flex',
                }}
              >
                <User size={18} />
              </div>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '7px',
              }}
            >
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  display: 'flex',
                }}
              >
                <Lock size={18} />
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '13px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'LOG IN TO ATLAS'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* QUICK DEMO CREDENTIALS */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #f3f4f6',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '12px',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}
          >
            QUICK DEMO ACCOUNTS
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => fillQuickDemo('admin', 'admin123')}
              style={{
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ color: '#111827', fontWeight: 700 }}>Admin Login</div>
              <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                admin / admin123
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillQuickDemo('user', 'user123')}
              style={{
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ color: '#111827', fontWeight: 700 }}>User Login</div>
              <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                user / user123
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* OPTIONAL FACE VERIFICATION STEP MODAL */}
      {pendingAuth && (
        <FaceAuthModal
          user={pendingAuth.user}
          onComplete={handleFaceComplete}
          onSkip={handleFaceSkip}
          onCancel={handleFaceCancel}
        />
      )}
    </div>
  );
};

export default LoginPage;
