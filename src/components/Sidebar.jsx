import React from 'react';
import { 
  LayoutDashboard, 
  Eye, 
  Radio, 
  Brain, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';

export const Sidebar = ({ 
  activePage, 
  setActivePage, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const navItems = [
    { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard, accent: '#00f2fe' },
    { id: 'vision-intelligence', label: 'Vision Intelligence', icon: Eye, accent: '#00f2fe' },
    { id: 'sensor-network', label: 'Sensor Network', icon: Radio, accent: '#10b981' },
    { id: 'core-intelligence', label: 'Core Intelligence', icon: Brain, accent: '#8b5cf6' },
    { id: 'atlas-act', label: 'ATLAS Act', icon: Zap, accent: '#f59e0b' }
  ];

  return (
    <aside className={`sidebar-container glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Shield size={20} />
          </div>
          {!isCollapsed && <span className="brand-text font-header">ATLAS</span>}
        </div>
        <button 
          className="toggle-sidebar-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              style={{ '--item-accent': item.accent }}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrap">
                <IconComp size={20} />
              </div>
              {!isCollapsed && <span className="nav-label font-tech">{item.label}</span>}
              {isActive && <div className="nav-active-pill"></div>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-status-box">
            <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
              MATRIX STATUS
            </span>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--emerald-bright)' }}>
              ● 100% NOMINAL
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
