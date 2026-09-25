import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Split, 
  CheckSquare, 
  Briefcase, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  BookOpen,
  Send,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CircularProgress from '../components/CircularProgress';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch user progress
        const progressRes = await api.get('/progress');
        if (progressRes.data.success) {
          setProgressData(progressRes.data.progress);
        }

        // 2. Fetch skill gap analysis
        const gapRes = await api.get('/skill-gap');
        if (gapRes.data.success) {
          setSkillGap(gapRes.data.analysis);
        }

        // 3. Fetch applications
        const appsRes = await api.get('/applications');
        if (appsRes.data.success) {
          setRecentApplications(appsRes.data.applications.slice(0, 3));
        }

        // 4. Fetch recommended jobs
        const jobsRes = await api.get('/jobs');
        if (jobsRes.data.success) {
          setRecommendedJobs(jobsRes.data.jobs.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const overallProgress = progressData?.overallProgressPercentage || 0;
  const targetCareer = progressData?.career || user?.targetCareer;

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p>Loading your personalized dashboard...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div className="card glass-panel" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
            <Sparkles size={15} /> Welcome back to CareerPath
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800', marginBottom: '0.5rem' }}>
            Hello, {user?.name}! 👋
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '600px' }}>
            Target Track: <strong style={{ color: '#06b6d4' }}>{targetCareer?.title || 'Tech Career Track'}</strong>
            {targetCareer?.category && <span> • {targetCareer.category}</span>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/roadmap" className="btn btn-primary">
            <Map size={16} /> Continue Roadmap
          </Link>
          <Link to="/skill-gap" className="btn btn-secondary">
            <Split size={16} /> View Skill Gaps
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Metric 1: Roadmap Completion */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Roadmap Progress</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', margin: '0.35rem 0' }}>
              {overallProgress}%
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <TrendingUp size={13} /> Active progression
            </span>
          </div>
          <CircularProgress percentage={overallProgress} size={64} strokeWidth={6} color="#6366f1" />
        </div>

        {/* Metric 2: Skills Match */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Target Skill Match</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#06b6d4', margin: '0.35rem 0' }}>
              {skillGap?.matchPercentage || 0}%
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {skillGap?.masteredSkills?.length || 0} of {skillGap?.requiredSkills?.length || 0} skills acquired
            </span>
          </div>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4',
          }}>
            <Award size={28} />
          </div>
        </div>

        {/* Metric 3: Assessments Taken */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Verified Assessments</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', margin: '0.35rem 0' }}>
              {user?.assessmentResults?.length || 0}
            </div>
            <Link to="/assessments" style={{ fontSize: '0.78rem', color: '#10b981', textDecoration: 'underline' }}>
              Take assessment quiz →
            </Link>
          </div>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981',
          }}>
            <CheckSquare size={28} />
          </div>
        </div>

        {/* Metric 4: Job Applications */}
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Job Applications</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f59e0b', margin: '0.35rem 0' }}>
              {recentApplications.length}
            </div>
            <Link to="/applications" style={{ fontSize: '0.78rem', color: '#f59e0b', textDecoration: 'underline' }}>
              Track applications →
            </Link>
          </div>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
          }}>
            <Send size={28} />
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Gap Summary & Next Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
      }}>
        
        {/* Left Column: Skill Gap Breakdown */}
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Skill Gap Overview</h2>
            <Link to="/skill-gap" style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: '600' }}>Full Analysis →</Link>
          </div>

          {skillGap ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Mastered */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> Mastered Skills ({skillGap.masteredSkills?.length || 0})
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skillGap.masteredSkills?.map((s, i) => (
                    <span key={i} className="badge badge-success">{s.skillName || s.name || s}</span>
                  ))}
                  {(!skillGap.masteredSkills || skillGap.masteredSkills.length === 0) && (
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No verified mastered skills yet.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={14} /> Missing Skills To Learn ({skillGap.missingSkills?.length || 0})
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skillGap.missingSkills?.map((s, i) => (
                    <span key={i} className="badge badge-danger">{s.skillName || s.name || s}</span>
                  ))}
                  {(!skillGap.missingSkills || skillGap.missingSkills.length === 0) && (
                    <span style={{ fontSize: '0.82rem', color: '#10b981' }}>Great job! You have all required skills.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Select a target career to see your skill gaps.</p>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <Link to="/roadmap" className="btn btn-outline btn-block btn-sm">
              <Map size={15} /> Jump to Current Level in Roadmap
            </Link>
          </div>
        </div>

        {/* Right Column: Matched Job Opportunities */}
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Matched Job Openings</h2>
            <Link to="/jobs" style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: '600' }}>View All Jobs →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem' }}>{job.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {job.company} • {job.location} • <span style={{ color: '#10b981' }}>{job.salaryRange}</span>
                  </p>
                </div>
                <Link to="/jobs" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  Apply
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <Link to="/assessments" className="btn btn-secondary btn-block btn-sm">
              <CheckSquare size={15} /> Validate More Skills with Quizzes
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
