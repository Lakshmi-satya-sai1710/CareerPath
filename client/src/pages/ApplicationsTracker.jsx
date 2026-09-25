import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Clock, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import api from '../services/api';

const ApplicationsTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/me');
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="badge badge-success">✓ Offer Extended / Selected</span>;
      case 'Interview':
        return <span className="badge badge-primary">🎯 Interview Scheduled</span>;
      case 'Shortlisted':
      case 'Under Review':
        return <span className="badge badge-warning">⏳ Under Review</span>;
      case 'Rejected':
        return <span className="badge badge-danger">✗ Not Selected</span>;
      default:
        return <span className="badge badge-info">📩 Applied</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Application Pipeline</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          My Job Applications
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.35rem' }}>
          Track the real-time status and recruitment pipeline of your submitted job applications.
        </p>
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Briefcase size={44} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3>You haven't submitted any job applications yet</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem auto 1.5rem', maxWidth: '480px' }}>
            Explore verified job opportunities matched to your skill profile and apply in one click.
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Explore Job Openings
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <div
              key={app._id}
              className="card glass-panel card-hover"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc' }}>
                    {app.job?.title || 'Tech Role'}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#cbd5e1' }}>
                    <Building2 size={14} color="#6366f1" /> {app.job?.company}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#06b6d4" /> {app.job?.location}
                  </span>
                  <span>•</span>
                  <span>Applied on {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}</span>
                </div>

                {app.notes && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <strong>Note: </strong>{app.notes}
                  </div>
                )}
              </div>

              <div>
                <Link to="/jobs" className="btn btn-outline btn-sm">
                  View Job Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ApplicationsTracker;
