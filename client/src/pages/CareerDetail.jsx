import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  ArrowLeft, 
  Target, 
  Map, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Code
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, updateUserState } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/careers/${id}`);
        if (response.data.success) {
          setCareer(response.data.career);
        }
      } catch (err) {
        console.error('Failed to load career details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  const handleSetTarget = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.put('/users/profile', { targetCareer: career._id });
      if (response.data.success) {
        updateUserState(response.data.user);
        addToast(`Target career set to ${career.title}!`, 'success');
        navigate('/roadmap');
      }
    } catch (err) {
      addToast('Failed to set target career.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#5D706B' }}>
        <p>Loading career path details...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: '#063B32' }}>Career track not found</h2>
        <Link to="/careers" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Careers
        </Link>
      </div>
    );
  }

  const isTarget = user?.targetCareer === career._id || user?.targetCareer?._id === career._id;

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Back Link */}
      <div>
        <Link to="/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#5D706B', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to all careers
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="card" style={{
        padding: '2.5rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #063B32 0%, #159447 100%)',
        color: '#FFFFFF',
        boxShadow: '0 10px 25px rgba(6, 59, 50, 0.15)',
        border: 'none',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: '#EEF8F2', color: '#159447' }}>{career.category}</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>{career.difficulty}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', marginBottom: '0.75rem', color: '#FFFFFF' }}>
              {career.title}
            </h1>
            <p style={{ color: '#EEF8F2', fontSize: '1.05rem', maxWidth: '750px', lineHeight: '1.6', opacity: 0.95 }}>
              {career.description}
            </p>
          </div>

          {/* Target Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleSetTarget}
              className={`btn btn-lg ${isTarget ? 'btn-outline' : 'btn-secondary'}`}
              style={{
                minWidth: '220px',
                background: isTarget ? 'transparent' : '#FFFFFF',
                color: isTarget ? '#FFFFFF' : '#063B32',
                borderColor: isTarget ? 'rgba(255,255,255,0.6)' : '#FFFFFF',
              }}
            >
              <Target size={18} /> {isTarget ? 'Current Active Target' : 'Set as My Target Career'}
            </button>
            <Link
              to={`/roadmap?careerId=${career._id}`}
              className="btn btn-lg"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <Map size={18} /> Open Interactive Roadmap
            </Link>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#EEF8F2', opacity: 0.85 }}>Average Market Salary</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.2rem' }}>
              {career.averageSalary}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#EEF8F2', opacity: 0.85 }}>Estimated Learning Time</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.2rem' }}>
              {career.estimatedDuration}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#EEF8F2', opacity: 0.85 }}>Job Market Outlook</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.2rem' }}>
              {career.jobOutlook}
            </div>
          </div>
        </div>
      </div>

      {/* Required Skills Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#063B32', marginBottom: '1.25rem' }}>
          Key Technologies & Competencies
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {career.requiredSkills?.map((skill, idx) => (
            <div key={idx} style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: '#F8FCF9',
              border: '1px solid #D9E9DF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#12332D',
            }}>
              <Code size={16} color="#159447" />
              {skill.name || skill}
            </div>
          ))}
        </div>
      </div>

      {/* 7-Level Roadmap Stages Preview */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#063B32', marginBottom: '1.5rem' }}>
          Curriculum & 7-Stage Progression
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {career.roadmap?.map((stage, idx) => (
            <div key={idx} style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: '#FFFFFF',
              border: '1px solid #D9E9DF',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EEF8F2',
                color: '#159447',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #D9E9DF',
              }}>
                {stage.level || idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#063B32', marginBottom: '0.35rem' }}>
                  {stage.title}
                </h3>
                <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                  {stage.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {stage.skills?.map((s, sIdx) => (
                    <span key={sIdx} className="badge badge-primary">{s.name || s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CareerDetail;
