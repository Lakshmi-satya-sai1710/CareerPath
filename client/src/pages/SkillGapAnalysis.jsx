import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Split, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Map, 
  CheckSquare, 
  BookOpen,
  Award,
  BarChart2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '../components/CircularProgress';

const SkillGapAnalysis = () => {
  const [searchParams] = useSearchParams();
  const careerIdQuery = searchParams.get('careerId');

  const [gapData, setGapData] = useState(null);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGap = async (cId) => {
    try {
      setLoading(true);
      const url = cId ? `/skill-gap?careerId=${cId}` : '/skill-gap';
      const response = await api.get(url);
      if (response.data.success) {
        setGapData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch skill gap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGap(careerIdQuery);

    api.get('/careers').then((res) => {
      if (res.data.success) setCareers(res.data.careers);
    });
  }, [careerIdQuery]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
        <p>Analyzing skill readiness and calculating market gaps...</p>
      </div>
    );
  }

  if (!gapData) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>No Career Data Available</h2>
        <Link to="/careers" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Careers</Link>
      </div>
    );
  }

  const {
    career,
    readinessPercentage,
    totalRequired,
    matchCount,
    missingCount,
    matchedSkills,
    missingSkills,
  } = gapData;

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>AI Diagnostics</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Skill Gap & Readiness Analysis
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.35rem' }}>
          Compare your verified skills with industry requirements for <strong>{career?.title}</strong>.
        </p>
      </div>

      {/* Target Selector Card */}
      <div className="card glass-panel" style={{
        padding: '1.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Target size={22} color="#6366f1" />
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Evaluating Against:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
              {career?.title} ({career?.category})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Switch Career:</span>
          <select
            className="form-control"
            value={career?._id}
            onChange={(e) => fetchGap(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            {careers.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Readiness Overview Panel */}
      <div className="card glass-panel" style={{
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <CircularProgress percentage={readinessPercentage} size={110} strokeWidth={9} color={readinessPercentage >= 70 ? '#10b981' : '#6366f1'} />
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Role Readiness</span>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc', lineHeight: '1.1', margin: '0.25rem 0' }}>
              {readinessPercentage}%
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              {readinessPercentage >= 75
                ? 'High readiness! You are ready to apply for junior to mid-level roles.'
                : readinessPercentage >= 40
                ? 'Solid base! Focus on the remaining missing core skills below.'
                : 'Beginning phase. Follow the 7-stage roadmap to systematically build proficiency.'}
            </p>
          </div>
        </div>

        {/* Quick breakdown metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>
              <CheckCircle2 size={16} /> Acquired Skills
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', marginTop: '0.2rem' }}>
              {matchCount} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '400' }}>/ {totalRequired}</span>
            </div>
          </div>

          <div style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>
              <AlertCircle size={16} /> Missing Gaps
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', marginTop: '0.2rem' }}>
              {missingCount} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '400' }}>skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
      }}>
        
        {/* Acquired Skills Card */}
        <div className="card glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <CheckCircle2 size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
              Acquired & Mastered Skills ({matchedSkills.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {matchedSkills.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontWeight: '600', color: '#f8fafc' }}>{s.name}</span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Verified 100%</span>
              </div>
            ))}

            {matchedSkills.length === 0 && (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
                No verified skills recorded yet for this career path.
              </p>
            )}
          </div>
        </div>

        {/* Missing Skills Card */}
        <div className="card glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
            <AlertCircle size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
              Missing Skills To Learn ({missingSkills.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {missingSkills.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} color="#ef4444" />
                  <span style={{ fontWeight: '600', color: '#f8fafc' }}>{s.name}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Link
                    to={`/roadmap?careerId=${career._id}`}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Learn in Roadmap
                  </Link>
                </div>
              </div>
            ))}

            {missingSkills.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#10b981' }}>
                <Award size={36} style={{ margin: '0 auto 0.5rem' }} />
                <h4>Zero Gaps Remaining!</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>You have matched 100% of the required tech stack.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Banner */}
      <div className="card glass-panel" style={{
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            Ready to close your remaining skill gaps?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Take verified quizzes to certify your skills or follow your step-by-step roadmap.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/roadmap?careerId=${career?._id}`} className="btn btn-primary">
            <Map size={16} /> Open Roadmap
          </Link>
          <Link to="/assessments" className="btn btn-secondary">
            <CheckSquare size={16} /> Take Skill Quizzes
          </Link>
        </div>
      </div>

    </div>
  );
};

export default SkillGapAnalysis;
