import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Split, 
  CheckSquare, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Award, 
  Users, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get('/careers');
        if (response.data.success) {
          setFeaturedCareers(response.data.careers.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured careers:', err);
      } finally {
        setLoadingCareers(false);
      }
    };
    fetchCareers();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 3rem',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Background Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          
          {/* Top Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#818cf8',
          }}>
            <Sparkles size={16} />
            <span>AI-Powered Skill Gap Analysis & Career Roadmaps</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
            marginBottom: '1.5rem',
          }}>
            Bridge Your Skill Gaps. <br />
            <span className="title-gradient">Master Your Dream Tech Career.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            lineHeight: '1.6',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
          }}>
            Analyze your current skills against industry requirements, generate structured 7-level interactive roadmaps, take skill validation quizzes, and apply for matched tech roles.
          </p>

          {/* CTA Button Group */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg" style={{ minWidth: '150px' }}>
                  Demo Login
                </Link>
              </>
            )}
            <Link to="/careers" className="btn btn-outline btn-lg">
              Explore 11+ Careers
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            marginTop: '4rem',
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)',
          }}>
            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#f8fafc' }}>11+ Tracks</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Curated Tech Careers</div>
            </div>
            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#6366f1' }}>35+ Skills</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Comprehensive Mapping</div>
            </div>
            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#06b6d4' }}>50+ Quizzes</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Interactive Assessments</div>
            </div>
            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#10b981' }}>20+ Live Jobs</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Direct Match Portal</div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Features Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>How It Works</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            A Complete Career Acceleration Engine
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Everything you need to go from your current knowledge to landing high-paying tech jobs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Feature 1 */}
          <div className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#6366f1',
            }}>
              <Split size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              Instant Skill Gap Analysis
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
              Select any tech path and our intelligence engine pinpoints your mastered skills, in-progress items, and missing prerequisites with match percentages.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/skill-gap" style={{ color: '#6366f1', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Analyze your gaps <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#06b6d4',
            }}>
              <Map size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              Interactive 7-Level Roadmaps
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
              Structured progression trees covering fundamentals, frontend/backend architecture, database optimization, cloud DevOps, security, and capstone projects.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/roadmap" style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                View roadmap tree <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#10b981',
            }}>
              <CheckSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              Skill Assessment Quizzes
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
              Validate your practical knowledge through timed MCQ tests. Passing scores automatically certify your proficiency and update your verified profile skills.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/assessments" style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Take a quiz <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#f59e0b',
            }}>
              <Briefcase size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              Smart Job Matching
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
              Browse real industry job openings dynamically scored against your verified skill profile. Apply with 1-click and track application statuses in real-time.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/jobs" style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Find matched jobs <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Career Paths */}
      <section className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Explore Tracks</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Featured Tech Career Paths</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>High-growth career tracks engineered with complete step-by-step milestones.</p>
          </div>
          <Link to="/careers" className="btn btn-outline btn-sm">
            View All 11+ Careers <ArrowRight size={15} />
          </Link>
        </div>

        {loadingCareers ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading tracks...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {featuredCareers.map((c) => (
              <div key={c._id} className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-primary">{c.category}</span>
                  <span className="badge badge-warning">{c.difficulty}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', flex: 1, marginBottom: '1rem' }}>
                  {c.description.slice(0, 110)}...
                </p>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600', marginBottom: '1.25rem' }}>
                  Avg Salary: {c.averageSalary}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to={`/careers/${c._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    View Path
                  </Link>
                  <Link to={`/roadmap?careerId=${c._id}`} className="btn btn-outline btn-sm">
                    Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="container">
        <div style={{
          position: 'relative',
          padding: '4rem 2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: '800', marginBottom: '1rem' }}>
            Ready to Accelerate Your Career Trajectory?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join CareerPath today to identify your personalized learning curve and get hired faster.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free Today <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login to Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
