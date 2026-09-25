import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetCareer: '',
    experienceLevel: 'Beginner',
  });
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get('/careers');
        if (response.data.success) {
          setCareers(response.data.careers);
          if (response.data.careers.length > 0) {
            setFormData((prev) => ({ ...prev, targetCareer: response.data.careers[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load careers:', err);
      }
    };
    fetchCareers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      background: '#F8FCF9',
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid #D9E9DF',
        background: '#FFFFFF',
      }}>
        
        {/* Header */}
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
            Start Your Journey
          </h1>
          <p style={{ color: '#5D706B', fontSize: '0.9rem' }}>
            Create an account to personalize your tech career roadmap
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Full Name */}
          <div>
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-name"
                type="text"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="#839791" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-email"
                type="email"
                name="email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="#839791" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label" htmlFor="register-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type="password"
                name="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="#839791" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Target Career Selection */}
          <div>
            <label className="form-label" htmlFor="register-career">Target Career Path</label>
            <select
              id="register-career"
              name="targetCareer"
              className="form-control"
              value={formData.targetCareer}
              onChange={handleChange}
            >
              {careers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="form-label">Current Experience Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                  style={{
                    padding: '0.6rem 0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: formData.experienceLevel === lvl ? '#159447' : '#D9E9DF',
                    background: formData.experienceLevel === lvl ? '#EEF8F2' : '#FFFFFF',
                    color: formData.experienceLevel === lvl ? '#159447' : '#5D706B',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Creating account...' : 'Create Account & Generate Roadmap'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#5D706B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#159447', fontWeight: '700' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
