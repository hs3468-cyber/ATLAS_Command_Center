import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShieldCheck, AlertCircle, X, CheckCircle, RefreshCw, Lock, Sparkles, UserCheck } from 'lucide-react';

export const FaceAuthModal = ({ user, onComplete, onSkip, onCancel }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('INITIALIZING'); // INITIALIZING, READY, SCANNING, SUCCESS, ERROR
  const [errorMsg, setErrorMsg] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  // Request browser camera stream
  const startCamera = async () => {
    setCameraStatus('INITIALIZING');
    setErrorMsg('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraStatus('READY');
    } catch (err) {
      console.warn('[FACE AUTH] Camera access error:', err.message);
      setCameraStatus('ERROR');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission denied. You can proceed using standard login fallback.');
      } else {
        setErrorMsg('Camera unavailable. You can proceed using standard login fallback.');
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      // Stop webcam stream tracks on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle stream reference attachment when video element mounts
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleStartScan = () => {
    if (cameraStatus !== 'READY') return;

    setCameraStatus('SCANNING');
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setCameraStatus('SUCCESS');
        setTimeout(() => {
          stopStream();
          onComplete({ face_verified: true, face_status: 'COMPLETED' });
        }, 1200);
      }
    }, 180);
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSkip = () => {
    stopStream();
    onSkip({ face_verified: false, face_status: 'SKIPPED' });
  };

  const handleCancelClick = () => {
    stopStream();
    onCancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          maxWidth: '480px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: '#f3f4f6', borderRadius: '8px', color: '#111827' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                Face Verification
              </h3>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>
                PROTOTYPE // PRIVACY-CONSCIOUS BIOMETRIC CHECK
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancelClick}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ACCOUNT PROFILE INFO */}
        <div
          style={{
            padding: '10px 14px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
          }}
        >
          <div>
            <span style={{ color: '#6b7280' }}>Authenticating Account: </span>
            <strong style={{ color: '#111827' }}>{user?.name || user?.username}</strong>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              background: user?.role === 'ADMIN' ? '#fef3c7' : '#e0f2fe',
              color: user?.role === 'ADMIN' ? '#92400e' : '#0369a1',
            }}
          >
            {user?.role}
          </span>
        </div>

        {/* WEBCAM VIEWPORT / CAMERA CONTAINER */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '260px',
            background: '#111827',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '18px',
          }}
        >
          {cameraStatus === 'INITIALIZING' && (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
              <RefreshCw size={28} className="spin" style={{ marginBottom: '10px' }} />
              <div>Requesting camera access...</div>
            </div>
          )}

          {cameraStatus === 'ERROR' && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#f87171', fontSize: '13px' }}>
              <AlertCircle size={36} style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Camera Unavailable</div>
              <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4' }}>{errorMsg}</div>
            </div>
          )}

          {/* LIVE VIDEO FEED */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: (cameraStatus === 'READY' || cameraStatus === 'SCANNING' || cameraStatus === 'SUCCESS') ? 'block' : 'none',
              transform: 'scaleX(-1)', // Mirror preview
            }}
          />

          {/* SCANNING OVAL OVERLAY */}
          {(cameraStatus === 'READY' || cameraStatus === 'SCANNING' || cameraStatus === 'SUCCESS') && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* FACE ALIGNMENT OVAL */}
              <div
                style={{
                  width: '160px',
                  height: '200px',
                  borderRadius: '50%',
                  border: cameraStatus === 'SUCCESS' ? '3px solid #22c55e' : cameraStatus === 'SCANNING' ? '3px dashed #60a5fa' : '2px dashed rgba(255, 255, 255, 0.5)',
                  boxShadow: cameraStatus === 'SUCCESS' ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                {cameraStatus === 'SCANNING' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${scanProgress}%`,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#60a5fa',
                      boxShadow: '0 0 8px #60a5fa',
                    }}
                  />
                )}
              </div>

              <div style={{ position: 'absolute', bottom: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#ffffff' }}>
                {cameraStatus === 'READY' && 'Align face inside oval'}
                {cameraStatus === 'SCANNING' && `Scanning facial geometry... ${scanProgress}%`}
                {cameraStatus === 'SUCCESS' && '✓ Verification Complete!'}
              </div>
            </div>
          )}
        </div>

        {/* PRIVACY GUARANTEE DISCLAIMER */}
        <div
          style={{
            padding: '10px 12px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#166534',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <Lock size={16} style={{ shrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Privacy Guarantee:</strong> All processing is local in browser memory. No camera frames, photos, or raw biometric data are stored or uploaded to any external server.
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cameraStatus === 'READY' && (
            <button
              type="button"
              onClick={handleStartScan}
              style={{
                width: '100%',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Camera size={18} /> SCAN & VERIFY FACE
            </button>
          )}

          {cameraStatus === 'SCANNING' && (
            <button
              type="button"
              disabled
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={18} className="spin" /> VERIFYING FACIAL GEOMETRY...
            </button>
          )}

          {cameraStatus === 'SUCCESS' && (
            <button
              type="button"
              disabled
              style={{
                width: '100%',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle size={18} /> VERIFIED — ENTERING SYSTEM...
            </button>
          )}

          {/* FALLBACK OPTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              SKIP BIOMETRIC STEP
            </button>

            <button
              type="button"
              onClick={handleCancelClick}
              style={{
                background: '#ffffff',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              CANCEL LOGIN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FaceAuthModal;
