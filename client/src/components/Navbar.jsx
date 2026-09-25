import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Map, 
  Split, 
  CheckSquare, 
  Briefcase, 
  Send, 
  ShieldAlert, 
  LayoutDashboard, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: isActive ? '#f8fafc' : '#94a3b8',
    padding: '0.45rem 0.8rem',
    borderRadius: '8px',
    background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Career<span className="title-gradient">Path</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          <NavLink to="/careers" style={navLinkStyle}>
            <Compass size={16} /> Careers
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/roadmap" style={navLinkStyle}>
                <Map size={16} /> Roadmap
              </NavLink>
              <NavLink to="/skill-gap" style={navLinkStyle}>
                <Split size={16} /> Skill Gap
              </NavLink>
              <NavLink to="/assessments" style={navLinkStyle}>
                <CheckSquare size={16} /> Assessments
              </NavLink>
            </>
          )}
          <NavLink to="/jobs" style={navLinkStyle}>
            <Briefcase size={16} /> Jobs
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/applications" style={navLinkStyle}>
              <Send size={16} /> Applications
            </NavLink>
          )}
        </nav>

        {/* Right Action Area */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
              {isAdmin && (
                <Link to="/admin/dashboard" className="badge badge-warning" style={{ textDecoration: 'none', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <ShieldAlert size={14} /> Admin Portal
                </Link>
              )}

              <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.9rem' }}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>

              {/* User Dropdown Trigger */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--gradient-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'white',
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '210px',
                  background: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.5rem',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#cbd5e1', borderRadius: '6px' }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#cbd5e1', borderRadius: '6px' }}
                  >
                    <UserIcon size={15} /> Profile & Skills
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#f87171',
                      borderRadius: '6px',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', color: '#f8fafc', padding: '0.5rem' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem 1.5rem',
          background: '#0b0f19',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <Link to="/careers" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
            <Compass size={18} /> Careers
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
                <LayoutDashboard size={18} /> Student Dashboard
              </Link>
              <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
                <Map size={18} /> Roadmap
              </Link>
              <Link to="/skill-gap" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
                <Split size={18} /> Skill Gap
              </Link>
              <Link to="/assessments" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
                <CheckSquare size={18} /> Assessments
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
                <UserIcon size={18} /> Profile & Skills
              </Link>
            </>
          )}
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
            <Briefcase size={18} /> Jobs Portal
          </Link>
          {isAuthenticated && (
            <Link to="/applications" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
              <Send size={18} /> My Applications
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', color: '#fbbf24' }}>
              <ShieldAlert size={18} /> Admin Console
            </Link>
          )}
          <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
