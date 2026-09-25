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
  ChevronDown,
  Search,
  ArrowRight
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
    fontSize: '0.925rem',
    fontWeight: '600',
    color: isActive ? '#159447' : '#12332D',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    background: isActive ? '#EEF8F2' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: '#FFFFFF',
      borderBottom: '1px solid #D9E9DF',
      boxShadow: '0 2px 10px rgba(18, 51, 45, 0.04)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #063B32 0%, #159447 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(21, 148, 71, 0.25)',
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#063B32', lineHeight: '1.1' }}>
              Career<span style={{ color: '#159447' }}>Path</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.35rem', alignItems: 'center' }} className="desktop-nav">
          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/careers" style={navLinkStyle}>
            Careers
          </NavLink>
          <NavLink to="/jobs" style={navLinkStyle}>
            Jobs
          </NavLink>
          <NavLink to="/roadmap" style={navLinkStyle}>
            Roadmaps
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/skill-gap" style={navLinkStyle}>
                Skill Gap
              </NavLink>
              <NavLink to="/assessments" style={navLinkStyle}>
                Assessments
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Action Area */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-actions">
          {/* Search Trigger */}
          <Link
            to="/careers"
            title="Search Careers & Skills"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5D706B',
              background: '#F8FCF9',
              border: '1px solid #D9E9DF',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#159447';
              e.currentTarget.style.borderColor = '#159447';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#5D706B';
              e.currentTarget.style.borderColor = '#D9E9DF';
            }}
          >
            <Search size={18} />
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
              {isAdmin && (
                <Link to="/admin/dashboard" className="badge badge-warning" style={{ textDecoration: 'none', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  <ShieldAlert size={14} /> Admin Portal
                </Link>
              )}

              <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ padding: '0.45rem 0.95rem' }}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>

              {/* User Dropdown Trigger */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#F8FCF9',
                  border: '1px solid #D9E9DF',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #159447 0%, #22A861 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'white',
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#12332D', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#5D706B" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: '220px',
                  background: '#FFFFFF',
                  border: '1px solid #D9E9DF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.5rem',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #EBF4EE', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#063B32' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#5D706B', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#12332D', borderRadius: '6px' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#EEF8F2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LayoutDashboard size={15} color="#159447" /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#12332D', borderRadius: '6px' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#EEF8F2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <UserIcon size={15} color="#159447" /> Profile & Skills
                  </Link>
                  <Link
                    to="/applications"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#12332D', borderRadius: '6px' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#EEF8F2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Send size={15} color="#159447" /> My Applications
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#DC2626',
                      borderRadius: '6px',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.15rem' }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            padding: '0.5rem',
            color: '#12332D',
            borderRadius: '8px',
            background: '#F8FCF9',
            border: '1px solid #D9E9DF',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #D9E9DF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/careers" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Careers
          </NavLink>
          <NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Jobs
          </NavLink>
          <NavLink to="/roadmap" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Roadmaps
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/skill-gap" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                Skill Gap
              </NavLink>
              <NavLink to="/assessments" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                Assessments
              </NavLink>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                Profile
              </NavLink>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-outline"
                style={{ justifyContent: 'flex-start', color: '#DC2626', borderColor: '#FECACA' }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block">
                Log in
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
