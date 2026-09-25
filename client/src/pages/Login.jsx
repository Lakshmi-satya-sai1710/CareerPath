import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result?.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleDemoStudent = () => {
    setEmail('student@careerpath.com');
    setPassword('Student@123456');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@careerpath.com');
    setPassword('Admin@123456');
  };

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      background: '#F8FCF9',
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #D9E9DF',
        background: '#FFFFFF',
      }}>
        
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #063B32 0%, #159447 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 14px rgba(21, 148, 71, 0.25)',
          }}>
            <Compass size={26} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#063B32', marginBottom: '0.35rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#5D706B', fontSize: '0.9rem' }}>
            Sign in to continue your career roadmap journey
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div style={{
          background: '#EEF8F2',
          border: '1px dashed #BDE0CB',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#159447', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} /> Quick Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDemoStudent}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: '#FFFFFF',
                border: '1px solid #D9E9DF',
                borderRadius: '6px',
                color: '#12332D',
                cursor: 'pointer',
              }}
            >
              <UserCheck size={14} color="#159447" /> Demo Student
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: '#FFFFFF',
                border: '1px solid #D9E9DF',
                borderRadius: '6px',
                color: '#12332D',
                cursor: 'pointer',
              }}
            >
              <Shield size={14} color="#063B32" /> Demo Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="#839791" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="#839791" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#5D706B' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#159447', fontWeight: '700' }}>
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
