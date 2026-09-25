import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Search, 
  Send, 
  Sparkles, 
  Building2,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [applying, setApplying] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedType !== 'All') {
      result = result.filter((j) => j.jobType === selectedType);
    }

    if (selectedLocation !== 'All') {
      result = result.filter((j) => j.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    setFilteredJobs(result);
  }, [searchQuery, selectedType, selectedLocation, jobs]);

  const handleOpenApplyModal = (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedJobForModal(job);
    setApplicationNotes('');
  };

  const handleConfirmApplication = async () => {
    if (!selectedJobForModal) return;

    try {
      setApplying(true);
      const res = await api.post(`/applications/${selectedJobForModal._id}`, {
        notes: applicationNotes,
      });

      if (res.data.success) {
        addToast(`Successfully applied to ${selectedJobForModal.company}!`, 'success');
        setSelectedJobForModal(null);
        fetchJobs();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      addToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="section-tag">OPPORTUNITY HUB</span>
        <h1 className="section-title">
          Matched Tech Job Openings
        </h1>
        <p className="section-subtitle" style={{ marginTop: '0.35rem' }}>
          Discover verified roles scored with match percentages against your verified skill profile.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} color="#839791" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by job title, company, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Job Type Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#5D706B', fontWeight: '600' }}>Type:</span>
          <select
            className="form-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5D706B' }}>Loading matched tech jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Briefcase size={40} color="#839791" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#063B32' }}>No matching jobs found</h3>
          <p style={{ color: '#5D706B', marginTop: '0.5rem' }}>Try clearing or adjusting your search filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredJobs.map((job) => {
            const matchPct = job.matchPercentage !== undefined ? job.matchPercentage : 0;
            const hasApplied = job.hasApplied;

            return (
              <div key={job._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {/* Match Badge */}
                {isAuthenticated && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}>
                    <span className="badge badge-primary">{job.jobType}</span>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      background: '#EEF8F2',
                      border: '1px solid #BDE0CB',
                      color: '#159447',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <Sparkles size={12} /> {matchPct}% Match
                    </span>
                  </div>
                )}

                {!isAuthenticated && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span className="badge badge-primary">{job.jobType}</span>
                  </div>
                )}

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#063B32', marginBottom: '0.35rem' }}>
                  {job.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#12332D', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <Building2 size={16} color="#159447" />
                  <strong>{job.company}</strong>
                </div>

                <p style={{ color: '#5D706B', fontSize: '0.85rem', lineHeight: '1.55', flex: 1, marginBottom: '1.25rem' }}>
                  {job.description?.slice(0, 130)}...
                </p>

                {/* Specs Box */}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8FCF9',
                  border: '1px solid #D9E9DF',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#12332D' }}>
                    <MapPin size={14} color="#063B32" />
                    <span>{job.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#12332D' }}>
                    <DollarSign size={14} color="#159447" />
                    <span>{job.salary || job.salaryRange || 'Competitive'}</span>
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#839791', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Required Stack ({job.requiredSkills?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {job.requiredSkills?.map((s, idx) => {
                      const isMastered = job.matchedSkills?.includes(s);

                      return (
                        <span
                          key={idx}
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            background: isMastered ? '#EEF8F2' : '#FFFFFF',
                            border: `1px solid ${isMastered ? '#BDE0CB' : '#D9E9DF'}`,
                            color: isMastered ? '#159447' : '#5D706B',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontWeight: isMastered ? '600' : '400',
                          }}
                        >
                          {isMastered && <Check size={11} />} {s}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Apply Button */}
                <div style={{ marginTop: 'auto' }}>
                  {hasApplied ? (
                    <button
                      type="button"
                      disabled
                      className="btn btn-outline btn-block"
                      style={{ color: '#159447', borderColor: '#BDE0CB', background: '#EEF8F2' }}
                    >
                      ✓ Applied
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(job)}
                      className="btn btn-primary btn-block"
                    >
                      <Send size={15} /> 1-Click Apply
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={!!selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
        title={`Apply for ${selectedJobForModal?.title}`}
      >
        {selectedJobForModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: '#F8FCF9', border: '1px solid #D9E9DF' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#063B32' }}>{selectedJobForModal.company}</h4>
              <p style={{ color: '#5D706B', fontSize: '0.85rem' }}>{selectedJobForModal.location} • {selectedJobForModal.salary || 'Competitive'}</p>
            </div>

            <div>
              <label className="form-label">Cover Note / Profile Highlight (Optional)</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Briefly describe why you are a great fit, highlight your verified skills, or link your portfolio..."
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedJobForModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApplication}
                disabled={applying}
                className="btn btn-primary"
              >
                {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default JobsList;
