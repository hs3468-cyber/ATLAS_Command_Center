import React from 'react';
import { Eye, Radio, Terminal, Layers } from 'lucide-react';

const iconMap = {
  Eye: Eye,
  Radio: Radio,
  Terminal: Terminal
};

export const ContextFusionCards = ({ fusionInputs }) => {
  return (
    <div className="glass-panel panel-box">
      <div className="panel-header">
        <h2 className="panel-title">
          <Layers size={18} />
          Multi-Modal Context Fusion
        </h2>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--purple-bright)' }}>
          FEEDING INTO ATLAS CORE
        </span>
      </div>

      <div className="fusion-cards-grid">
        {fusionInputs.map((input) => {
          const IconComp = iconMap[input.icon] || Layers;
          return (
            <div 
              key={input.id} 
              className="fusion-card"
              style={{ '--input-color': input.accentColor }}
            >
              <div className="fusion-card-top">
                <div className="fusion-source font-header">
                  <IconComp size={16} style={{ color: input.accentColor }} />
                  {input.source}
                </div>
                <span className="fusion-badge font-mono" style={{ color: input.accentColor, borderColor: input.accentColor }}>
                  {input.badge}
                </span>
              </div>
              <p className="fusion-summary">{input.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
