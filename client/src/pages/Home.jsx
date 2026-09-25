import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Code2,
  Star,
  UserPlus,
  BookOpen,
  Send,
  Laptop,
  Layers,
  Database,
  Cloud,
  Cpu,
  Lock,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [careers, setCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get('/careers');
        if (response.data.success) {
          setCareers(response.data.careers);
        }
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoadingCareers(false);
      }
    };
    fetchCareers();
  }, []);

  // Preset 8 curated careers for popular section
  const popularCareerPresets = [
    {
      title: 'Frontend Developer',
      icon: Code2,
      category: 'Web Development',
      description: 'Craft modern, responsive user interfaces utilizing React, TypeScript, state management, and modern CSS.',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      title: 'Backend Developer',
      icon: Database,
      category: 'Backend',
      description: 'Build robust REST APIs, microservices, databases, authentication, and high-performance server architectures.',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'SQL', 'PostgreSQL', 'Redis'],
    },
    {
      title: 'Full Stack Developer',
      icon: Layers,
      category: 'Full Stack',
      description: 'Master end-to-end web engineering from responsive frontends to scalable databases and cloud deployment.',
      skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
    },
    {
      title: 'Data Analyst',
      icon: BarChart3,
      category: 'Data Science',
      description: 'Transform raw business data into actionable visual insights with SQL, Python, and statistical modeling.',
      skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Analysis'],
    },
    {
      title: 'Data Scientist',
      icon: Cpu,
      category: 'Data Science',
      description: 'Design machine learning pipelines, predictive models, and algorithms to extract enterprise value.',
      skills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Algorithms'],
    },
    {
      title: 'Machine Learning Engineer',
      icon: Lightbulb,
      category: 'Artificial Intelligence',
      description: 'Deploy neural networks, deep learning architectures, computer vision, and NLP models to production.',
      skills: ['Python', 'Deep Learning', 'Machine Learning', 'NumPy', 'FastAPI'],
    },
    {
      title: 'Cloud Engineer',
      icon: Cloud,
      category: 'DevOps & Cloud',
      description: 'Orchestrate scalable cloud infrastructure, Docker containers, Kubernetes clusters, and CI/CD pipelines.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    },
    {
      title: 'Cybersecurity Analyst',
      icon: Lock,
      category: 'Security',
      description: 'Safeguard systems, audit vulnerabilities, secure network protocols, and implement zero-trust access controls.',
      skills: ['Cybersecurity Fundamentals', 'Linux', 'Network Protocols', 'Git'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section style={{
        position: 'relative',
        padding: '4.5rem 0 3.5rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FCF9 100%)',
        borderBottom: '1px solid #D9E9DF',
        overflow: 'hidden',
      }}>
        {/* Subtle Decorative Ambient Shapes */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #EEF8F2 0%, rgba(238, 248, 242, 0.2) 70%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #EEF8F2 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}>
            
            {/* Left Column: Headline & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Small Uppercase Label */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: '#EEF8F2',
                border: '1px solid #D9E9DF',
                color: '#159447',
                fontSize: '0.8rem',
                fontWeight: '800',
                letterSpacing: '0.8px',
                width: 'fit-content',
              }}>
                <Sparkles size={14} />
                <span>YOUR FUTURE STARTS HERE</span>
              </div>

              {/* Main Heading */}
              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                fontWeight: '800',
                color: '#063B32',
                lineHeight: '1.15',
                letterSpacing: '-1px',
              }}>
                Bridge Your Skills. <br />
                <span style={{ color: '#159447' }}>Build Your Dream Career.</span>
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '1.1rem',
                color: '#5D706B',
                lineHeight: '1.65',
                maxWidth: '540px',
              }}>
                Analyze your current skills against industry requirements, generate structured 7-level interactive roadmaps, take skill validation quizzes, and apply for matched tech roles.
              </p>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginTop: '0.5rem',
              }}>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Get Started Free <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                      Demo Login
                    </Link>
                  </>
                )}
                <Link to="/careers" className="btn btn-outline btn-lg">
                  Explore Careers
                </Link>
              </div>

              {/* Trust / Stat Line */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #D9E9DF',
              }}>
                {/* Avatar Circles */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {['#159447', '#063B32', '#22A861', '#0891b2'].map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: color,
                        border: '2px solid #FFFFFF',
                        marginLeft: idx === 0 ? 0 : '-8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      {['A', 'S', 'R', 'M'][idx]}
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#12332D' }}>
                    10,000+ learners building their dream careers
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Professional Image Collage */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              
              {/* Collage Container */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.9fr',
                gridTemplateRows: 'auto auto',
                gap: '1rem',
                width: '100%',
                maxWidth: '520px',
              }}>
                
                {/* 1. Large Main Card: Young Professional Working on Laptop */}
                <div style={{
                  gridRow: '1 / span 2',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid #D9E9DF',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                    alt="Professional working on career skills"
                    style={{
                      width: '100%',
                      height: '320px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{ padding: '1.25rem', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-success">7-Level Roadmap Active</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#063B32' }}>
                      Full Stack Engineer Track
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#5D706B' }}>
                      Stage 4: REST APIs & Database Optimization
                    </p>
                  </div>
                </div>

                {/* 2. Top Right Card: Modern Collaborative Office */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid #D9E9DF',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80"
                    alt="Modern tech workspace team"
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{ padding: '0.75rem', fontSize: '0.78rem', fontWeight: '600', color: '#12332D' }}>
                    🚀 22+ Live Partner Jobs
                  </div>
                </div>

                {/* 3. Bottom Right Card: Mentorship & Career Discussion */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid #D9E9DF',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80"
                    alt="Students discussing career goals"
                    style={{
                      width: '100%',
                      height: '130px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{ padding: '0.75rem', fontSize: '0.78rem', fontWeight: '600', color: '#159447' }}>
                    ✓ 94% Skill Match Rate
                  </div>
                </div>

              </div>

              {/* Floating Pill Accent */}
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '-15px',
                background: '#FFFFFF',
                border: '1px solid #D9E9DF',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem 1.1rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                zIndex: 2,
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#EEF8F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#159447',
                }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#063B32' }}>Verified Quizzes</div>
                  <div style={{ fontSize: '0.75rem', color: '#5D706B' }}>Score $\ge 70\%$ to certify</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 2. HOW IT WORKS SECTION */}
      {/* ============================================================ */}
      <section className="container" style={{ padding: '1rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-tag">HOW IT WORKS</span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
            Your Career, Simplified
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Get personalized guidance, learn new skills, and find the right opportunities — all in one place.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Step 1 */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <UserPlus size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#159447', marginBottom: '0.25rem' }}>STEP 01</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Create Your Profile
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Tell us about your skills, interests and goals to establish your baseline competency score.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <Map size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#159447', marginBottom: '0.25rem' }}>STEP 02</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Get Personalized Roadmap
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Explore 7-level interactive roadmaps based on your skill gap, curated with documentation and projects.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <CheckSquare size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#159447', marginBottom: '0.25rem' }}>STEP 03</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Take Skill Quizzes
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Validate your practical knowledge with timed assessments and automatically certify your profile skills.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <Briefcase size={26} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#159447', marginBottom: '0.25rem' }}>STEP 04</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Apply for Jobs
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Get matched with verified opportunities based on your score and track hiring pipelines in real time.
            </p>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 3. POPULAR CAREER PATHS SECTION */}
      {/* ============================================================ */}
      <section className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          <div>
            <span className="section-tag">POPULAR TRACKS</span>
            <h2 className="section-title">Popular Career Paths</h2>
            <p className="section-subtitle">
              Industry-aligned learning trajectories complete with step-by-step milestones and salary insights.
            </p>
          </div>
          <Link to="/careers" className="btn btn-secondary">
            View All 11+ Careers <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {popularCareerPresets.map((preset, idx) => {
            const IconComponent = preset.icon;
            // Match with DB career if available
            const matchedDbCareer = careers.find(
              (c) => c.title.toLowerCase().includes(preset.title.toLowerCase())
            );
            const targetUrl = matchedDbCareer ? `/careers/${matchedDbCareer._id}` : '/careers';

            return (
              <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#EEF8F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#159447',
                    border: '1px solid #D9E9DF',
                  }}>
                    <IconComponent size={22} />
                  </div>
                  <span className="badge badge-primary">{preset.category}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#063B32', marginBottom: '0.4rem' }}>
                  {preset.title}
                </h3>

                <p style={{ color: '#5D706B', fontSize: '0.875rem', lineHeight: '1.55', flex: 1, marginBottom: '1.25rem' }}>
                  {preset.description}
                </p>

                {/* Skills tags */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#839791', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Key Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {preset.skills.slice(0, 4).map((s, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          background: '#F8FCF9',
                          border: '1px solid #D9E9DF',
                          color: '#12332D',
                          fontWeight: '500',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {preset.skills.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: '#5D706B', alignSelf: 'center' }}>
                        +{preset.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link to={targetUrl} className="btn btn-secondary btn-block btn-sm">
                    View Roadmap <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ============================================================ */}
      {/* 4. SKILL GAP SECTION */}
      {/* ============================================================ */}
      <section style={{
        background: '#EEF8F2',
        borderTop: '1px solid #D9E9DF',
        borderBottom: '1px solid #D9E9DF',
        padding: '5rem 0',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-tag">AI SKILL GAP ANALYSIS</span>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
              Know Where You Stand. Know What To Learn.
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Our automated engine compares your profile against live industry benchmarks to illuminate your exact path forward.
            </p>
          </div>

          {/* Visual Progress Flow (4 steps) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
            marginBottom: '3.5rem',
          }}>
            {[
              { title: 'Current Skills', desc: 'Identify baseline skills you already possess', step: '01' },
              { title: 'Skill Gap Analysis', desc: 'Compare against target role requirements', step: '02' },
              { title: 'Personalized Roadmap', desc: 'Step-by-step 7-level learning curve', step: '03' },
              { title: 'Job Ready', desc: 'Verified portfolio matched with live roles', step: '04' },
            ].map((node, i) => (
              <div
                key={i}
                className="card"
                style={{
                  background: '#FFFFFF',
                  padding: '1.75rem 1.5rem',
                  borderRadius: '16px',
                  border: '1px solid #D9E9DF',
                  position: 'relative',
                }}
              >
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#159447',
                  opacity: 0.8,
                  marginBottom: '0.5rem',
                }}>
                  {node.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#063B32', marginBottom: '0.35rem' }}>
                  {node.title}
                </h3>
                <p style={{ color: '#5D706B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {node.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Gap CTA Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #D9E9DF',
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Live Diagnostic Engine</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#063B32', marginBottom: '0.5rem' }}>
                Want to calculate your readiness percentage?
              </h3>
              <p style={{ color: '#5D706B', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Choose any technology role and our system instantly isolates mastered vs. missing skills with customized quiz and roadmap recommendations.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/skill-gap" className="btn btn-primary btn-lg">
                <Split size={18} /> Analyze My Skill Gap
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================ */}
      {/* 5. CORE FEATURES SECTION */}
      {/* ============================================================ */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-tag">CORE CAPABILITIES</span>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
            Engineered for Career Acceleration
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Comprehensive toolkit empowering developers from foundational concepts to job offers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}>
          {/* Feature 1 */}
          <div className="card card-hover" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <Split size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              AI Skill Gap Analysis
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Pinpoint missing competencies and identify prerequisite technologies with automated readiness scoring.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card card-hover" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <Map size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Personalized Career Roadmaps
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Structured 7-level progressive curriculum covering fundamentals, databases, cloud, and capstone milestones.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card card-hover" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <CheckSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Skill Validation Quizzes
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Timed domain assessments with explanations that automatically certify and verify your profile skills upon scoring $\ge 70\%$.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card card-hover" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <Briefcase size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Smart Job Matching
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Real-time job opportunities scored with match percentages against your profile with 1-click application submission.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card card-hover" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Real-Time Progress Tracking
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Visual completion meters and checkbox milestones seamlessly synced across your MongoDB profile.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card card-hover" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#EEF8F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#159447',
              marginBottom: '1.25rem',
              border: '1px solid #D9E9DF',
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', marginBottom: '0.5rem' }}>
              Career Recommendations
            </h3>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Intelligent suggestions for next skills to prioritize based on trending hiring demands and salary trajectories.
            </p>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 6. CALL TO ACTION BANNER */}
      {/* ============================================================ */}
      <section className="container">
        <div style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #063B32 0%, #0F5E50 60%, #159447 100%)',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(6, 59, 50, 0.18)',
        }}>
          {/* Subtle Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 168, 97, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#EEF8F2',
              fontSize: '0.8rem',
              fontWeight: '700',
              letterSpacing: '0.8px',
              marginBottom: '1.25rem',
            }}>
              START YOUR TRANSFORMATION TODAY
            </span>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '1rem',
            }}>
              Ready to Accelerate Your Tech Career?
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: '#EEF8F2',
              lineHeight: '1.6',
              marginBottom: '2.5rem',
              opacity: 0.95,
            }}>
              Join thousands of ambitious developers identifying skill gaps, mastering structured roadmaps, and landing high-paying tech jobs.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              {isAuthenticated ? (
                <Link
                  to="/roadmap"
                  className="btn btn-lg"
                  style={{ background: '#FFFFFF', color: '#063B32', fontWeight: '700' }}
                >
                  <Map size={18} /> Open My Active Roadmap
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-lg"
                    style={{ background: '#FFFFFF', color: '#063B32', fontWeight: '700' }}
                  >
                    Get Started Free <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-lg"
                    style={{
                      background: 'transparent',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    Demo Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
