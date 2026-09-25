import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#FFFFFF',
      borderTop: '1px solid #D9E9DF',
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
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #063B32 0%, #159447 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Compass size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#063B32' }}>
                Career<span style={{ color: '#159447' }}>Path</span>
              </span>
            </div>
            <p style={{ color: '#5D706B', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              AI-powered skill gap analysis and 7-level interactive career roadmap generator for ambitious developers and professionals.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#5D706B', transition: 'color 0.2s' }}>
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#5D706B', transition: 'color 0.2s' }}>
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#5D706B', transition: 'color 0.2s' }}>
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#063B32', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#5D706B' }}>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Explore Careers</Link></li>
              <li><Link to="/skill-gap" style={{ color: 'inherit' }}>Skill Gap Analysis</Link></li>
              <li><Link to="/roadmap" style={{ color: 'inherit' }}>Personalized Roadmaps</Link></li>
              <li><Link to="/assessments" style={{ color: 'inherit' }}>Skill Assessments</Link></li>
              <li><Link to="/jobs" style={{ color: 'inherit' }}>Matched Job Portal</Link></li>
            </ul>
          </div>

          {/* Popular Tracks */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#063B32', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Popular Tracks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#5D706B' }}>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Frontend Developer</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Backend Engineer</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Full Stack Developer</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Data Scientist & AI</Link></li>
              <li><Link to="/careers" style={{ color: 'inherit' }}>Cloud & DevOps Engineer</Link></li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#063B32', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Built With
            </h4>
            <p style={{ color: '#5D706B', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              Modern MERN architecture utilizing React 18, Vite, Express, Node.js, and MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="badge badge-primary">React 18</span>
              <span className="badge badge-success">Node.js</span>
              <span className="badge badge-info">MongoDB</span>
              <span className="badge badge-primary">Express</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #D9E9DF',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#5D706B',
        }}>
          <div>
            © {new Date().getFullYear()} CareerPath Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Empowering tech learners worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
