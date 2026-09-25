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
        <span className="section-tag">APPLICATION PIPELINE</span>
        <h1 className="section-title">
          My Job Applications
        </h1>
        <p className="section-subtitle" style={{ marginTop: '0.35rem' }}>
          Track the real-time status and recruitment pipeline of your submitted job applications.
        </p>
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5D706B' }}>Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Briefcase size={44} color="#839791" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#063B32' }}>You haven't submitted any job applications yet</h3>
          <p style={{ color: '#5D706B', margin: '0.5rem auto 1.5rem', maxWidth: '480px' }}>
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
              className="card card-hover"
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
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#063B32' }}>
                    {app.job?.title || 'Tech Role'}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#5D706B', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#12332D', fontWeight: '600' }}>
                    <Building2 size={14} color="#159447" /> {app.job?.company}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#063B32" /> {app.job?.location}
                  </span>
                  <span>•</span>
                  <span>Applied on {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}</span>
                </div>

                {app.notes && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#5D706B', background: '#F8FCF9', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #D9E9DF' }}>
                    <strong>Note: </strong>{app.notes}
                  </div>
                )}
              </div>

              <div>
                <Link to="/jobs" className="btn btn-secondary btn-sm">
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
