import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Eye, 
  Radio, 
  Brain, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Video,
  Settings,
  Users,
  FileText,
  LogOut,
  UserCheck
} from 'lucide-react';

export const Sidebar = ({ 
  activePage, 
  setActivePage, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const { user, isAdmin, isUser, logout } = useAuth();

  const allNavItems = [
    { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard, accent: '#00f2fe', concept: 'STATUS', roles: ['ADMIN', 'USER'] },
    { id: 'vision-intelligence', label: 'Vision Intelligence', icon: Eye, accent: '#00f2fe', concept: 'VISION', roles: ['ADMIN', 'USER'] },
    { id: 'sensor-network', label: 'Sensor Network', icon: Radio, accent: '#10b981', concept: 'SENSE', roles: ['ADMIN', 'USER'] },
    { id: 'core-intelligence', label: 'Core Intelligence', icon: Brain, accent: '#8b5cf6', concept: 'CORE', roles: ['ADMIN', 'USER'] },
    { id: 'atlas-act', label: 'ATLAS Act', icon: Zap, accent: '#f59e0b', concept: 'ACT', roles: ['ADMIN', 'USER'] },
    { id: 'evidence-recordings', label: 'Evidence & Clips', icon: Video, accent: '#ef4444', concept: 'EVIDENCE', roles: ['ADMIN', 'USER'] },
    { id: 'privacy-consent', label: 'Privacy & Consent', icon: Shield, accent: '#10b981', concept: 'PRIVACY', roles: ['ADMIN', 'USER'] },
    { id: 'admin-audit', label: 'Audit Trail', icon: FileText, accent: '#6366f1', concept: 'AUDIT', roles: ['ADMIN'] },
    { id: 'drone-setup', label: 'Drone Activation Setup', icon: Settings, accent: '#f59e0b', concept: 'SETUP', roles: ['ADMIN'] },
    { id: 'user-management', label: 'User Management', icon: Users, accent: '#3b82f6', concept: 'USERS', roles: ['ADMIN'] },
  ];

  const userRole = user?.role || 'USER';
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className={`sidebar-container glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Shield size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <span className="brand-text font-header" style={{ display: 'block', lineHeight: 1 }}>ATLAS</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>WOMEN SAFETY & SURVEILLANCE</span>
            </div>
          )}
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
          <div className="sidebar-status-box" style={{ padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#111827' }}>
                {user?.name || 'Authorized User'}
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  background: isAdmin ? '#fef3c7' : '#e0f2fe',
                  color: isAdmin ? '#92400e' : '#0369a1',
                }}
              >
                {userRole}
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              style={{
                width: '100%',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '4px',
              }}
            >
              <LogOut size={12} /> LOG OUT
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
