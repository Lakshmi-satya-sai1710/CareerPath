import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Linkedin, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(11, 15, 25, 0.95)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Compass size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                Career<span className="title-gradient">Path</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Skill-Based Career Roadmap Generator empowering students and professionals to identify skill gaps and accelerate their tech careers.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Explore Careers</Link></li>
              <li><Link to="/skill-gap" style={{ color: 'inherit' }}>Skill Gap Analysis</Link></li>
              <li><Link to="/roadmap" style={{ color: 'inherit' }}>Personalized Roadmaps</Link></li>
              <li><Link to="/assessments" style={{ color: 'inherit' }}>Skill Assessments</Link></li>
              <li><Link to="/jobs" style={{ color: 'inherit' }}>Job Match Portal</Link></li>
            </ul>
          </div>

          {/* Popular Roadmaps */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Popular Tracks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li><Link to="/careers" style={{ color: 'inherit' }}>MERN Stack Developer</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Full Stack Engineer</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Data Science & AI</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>DevOps & Cloud Engineer</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Python Backend API</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              MERN Stack
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              Engineered with React 18, Vite, React Router, Node.js, Express, MongoDB Atlas, and JWT security.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="badge badge-primary">React 18</span>
              <span className="badge badge-info">Node.js</span>
              <span className="badge badge-success">MongoDB</span>
              <span className="badge badge-warning">Express</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748b',
        }}>
          <div>
            © {new Date().getFullYear()} CareerPath Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for empowering ambitious developers everywhere.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
