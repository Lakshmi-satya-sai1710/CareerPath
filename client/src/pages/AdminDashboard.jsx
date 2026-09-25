import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Compass, 
  Briefcase, 
  Send, 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  TrendingUp,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allApplications, setAllApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Create Job Modal state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    jobType: 'Full-time',
    description: '',
    requiredSkills: '',
    salary: '$90,000 - $120,000 / yr',
    experience: '1-3 Years',
  });
  const [creatingJob, setCreatingJob] = useState(false);

  const { addToast } = useToast();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, appsRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/applications/all'),
        api.get('/jobs'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data);
      if (appsRes.data.success) setAllApplications(appsRes.data.applications);
      if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`Updated application status to ${newStatus}`, 'success');
        setAllApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      addToast('Failed to update application status.', 'error');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      setCreatingJob(true);
      const res = await api.post('/jobs', newJobData);
      if (res.data.success) {
        addToast(`Created job posting for ${newJobData.title}!`, 'success');
        setJobModalOpen(false);
        setNewJobData({
          title: '',
          company: '',
          location: 'Remote',
          jobType: 'Full-time',
          description: '',
          requiredSkills: '',
          salary: '$90,000 - $120,000 / yr',
          experience: '1-3 Years',
        });
        fetchAdminData();
      }
    } catch (err) {
      addToast('Failed to post new job.', 'error');
    } finally {
      setCreatingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
        <p>Loading Admin intelligence portal...</p>
      </div>
    );
  }

  const s = stats?.stats || {};

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
            <ShieldAlert size={16} /> Admin Command Center
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Platform Administration
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setJobModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Post New Job Opening
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        <div className="card glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', marginBottom: '0.5rem' }}>
            <Users size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Enrolled Students</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {s.totalStudents || 0}
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', marginBottom: '0.5rem' }}>
            <Compass size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Active Careers</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {s.totalCareers || 0}
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.5rem' }}>
            <Briefcase size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Job Openings</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {s.totalJobs || 0}
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
            <Send size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Applications</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {s.totalApplications || 0}
          </div>
        </div>

        <div className="card glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', marginBottom: '0.5rem' }}>
            <CheckSquare size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Quiz Submissions</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            {s.totalAssessmentAttempts || 0}
          </div>
        </div>
      </div>

      {/* Applications Pipeline Management */}
      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Student Job Applications Pipeline ({allApplications.length})
        </h2>

        {allApplications.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No job applications submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Student</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role & Company</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Applied Date</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {allApplications.map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc' }}>{app.student?.name || 'Student'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{app.student?.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc' }}>{app.job?.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6366f1' }}>{app.job?.company}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#94a3b8' }}>
                      {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge ${
                        app.status === 'Selected' ? 'badge-success' :
                        app.status === 'Interview' ? 'badge-primary' :
                        app.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <select
                        className="form-control"
                        value={app.status}
                        onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post New Job Modal */}
      <Modal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        title="Post New Tech Job Opening"
      >
        <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Senior Frontend Engineer"
              value={newJobData.title}
              onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. TechCorp Labs"
                value={newJobData.company}
                onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Remote / San Francisco, CA"
                value={newJobData.location}
                onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Job Type</label>
              <select
                className="form-control"
                value={newJobData.jobType}
                onChange={(e) => setNewJobData({ ...newJobData, jobType: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. $90,000 - $130,000 / yr"
                value={newJobData.salary}
                onChange={(e) => setNewJobData({ ...newJobData, salary: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Required Skills (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. React, JavaScript, CSS, HTML, Redux"
              value={newJobData.requiredSkills}
              onChange={(e) => setNewJobData({ ...newJobData, requiredSkills: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe key responsibilities, team culture, and impact..."
              value={newJobData.description}
              onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setJobModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingJob}
              className="btn btn-primary"
            >
              {creatingJob ? 'Posting...' : 'Publish Job'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
