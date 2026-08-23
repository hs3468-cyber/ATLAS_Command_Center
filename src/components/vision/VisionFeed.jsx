import React, { useState, useEffect } from 'react';
import { Camera, Radio, Crosshair, ShieldCheck, Eye, Layers } from 'lucide-react';

export const VisionFeed = ({ metadata, targets, selectedTargetId, onSelectTarget }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toISOString().substring(11, 19) + ' UTC';

  return (
    <div className="glass-panel vision-feed-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Camera size={18} />
          Optical Processing Feed — {metadata.cameraId}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--cyan-bright)' }}>
            {metadata.resolution}
          </span>
          <div className="live-tag">
            <span className="live-dot"></span>
            LIVE
          </div>
        </div>
      </div>

      <div className="feed-viewport">
        {/* Animated Cyber Grid Overlay */}
        <div className="feed-grid-overlay"></div>

        {/* Scanning Sweep Line */}
        <div className="feed-scan-line"></div>

        {/* HUD Crosshair Center Mark */}
        <div className="feed-hud-center">
          <Crosshair size={32} />
        </div>

        {/* HUD Top Corner Metadata */}
        <div className="hud-top-left font-mono">
          <div>REC ● {timeStr}</div>
          <div>LOC: {metadata.location}</div>
          <div>ENGINE: {metadata.aiEngine}</div>
        </div>

        <div className="hud-top-right font-mono">
          <div>BANDWIDTH: {metadata.bandwidth}</div>
          <div>FRAME CONFIDENCE: 99.8%</div>
          <div>ENCRYPTION: AES-256</div>
        </div>

        {/* Bounding Box 1: ATLAS-P001 */}
        <div 
          className={`bounding-box box-p1 ${selectedTargetId === 'ATLAS-P001' ? 'selected' : ''}`}
          onClick={() => onSelectTarget('ATLAS-P001')}
        >
          <div className="box-corners"></div>
          <div className="box-tag font-mono">
            <span className="box-id">ATLAS-P001</span>
            <span className="box-conf">99.4%</span>
          </div>
          <div className="box-reticle"></div>
          <div className="box-sublabel font-mono">STAFF // NEUTRAL</div>
        </div>

        {/* Bounding Box 2: ATLAS-P002 */}
        <div 
          className={`bounding-box box-p2 ${selectedTargetId === 'ATLAS-P002' ? 'selected' : ''}`}
          onClick={() => onSelectTarget('ATLAS-P002')}
        >
          <div className="box-corners"></div>
          <div className="box-tag font-mono" style={{ borderColor: 'var(--purple-bright)', background: 'rgba(139, 92, 246, 0.2)' }}>
            <span className="box-id" style={{ color: 'var(--purple-bright)' }}>ATLAS-P002</span>
            <span className="box-conf">94.8%</span>
          </div>
          <div className="box-reticle"></div>
          <div className="box-sublabel font-mono">UNCLASSIFIED // CALM</div>
        </div>

        {/* Bounding Box 3: ATLAS-V003 */}
        <div 
          className={`bounding-box box-v3 ${selectedTargetId === 'ATLAS-V003' ? 'selected' : ''}`}
          onClick={() => onSelectTarget('ATLAS-V003')}
        >
          <div className="box-corners"></div>
          <div className="box-tag font-mono" style={{ borderColor: 'var(--emerald-bright)', background: 'rgba(16, 185, 129, 0.2)' }}>
            <span className="box-id" style={{ color: 'var(--emerald-bright)' }}>ATLAS-V003</span>
            <span className="box-conf">99.9%</span>
          </div>
          <div className="box-reticle"></div>
          <div className="box-sublabel font-mono">ROVER // PATROL</div>
        </div>

        {/* HUD Bottom Bar */}
        <div className="hud-bottom-bar font-mono">
          <span>TARGET LOCK: 3 SUBJECTS</span>
          <span style={{ color: 'var(--cyan-bright)' }}>AUTONOMOUS OPTICAL SEGMENTATION ACTIVE</span>
          <span>FPS: 60.0</span>
        </div>
      </div>
    </div>
  );
};
