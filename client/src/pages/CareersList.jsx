import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Filter, 
  ArrowRight, 
  Layers, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  Target
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CareersList = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const { user, isAuthenticated, updateUserState } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/careers');
        if (response.data.success) {
          setCareers(response.data.careers);
          setFilteredCareers(response.data.careers);
        }
      } catch (err) {
        console.error('Failed to fetch careers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  useEffect(() => {
    let result = careers;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.requiredSkills.some((s) => (s.name || s).toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      result = result.filter((c) => c.difficulty === selectedDifficulty);
    }

    setFilteredCareers(result);
  }, [searchQuery, selectedCategory, selectedDifficulty, careers]);

  const handleSetTargetCareer = async (careerId, title) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.put('/users/profile', { targetCareer: careerId });
      if (response.data.success) {
        updateUserState(response.data.user);
        addToast(`Set "${title}" as your active target career!`, 'success');
        navigate('/roadmap');
      }
    } catch (err) {
      addToast('Failed to update target career.', 'error');
    }
  };

  const categories = ['All', ...new Set(careers.map((c) => c.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Explore Tracks</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Explore Tech Career Tracks
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '650px', marginTop: '0.35rem' }}>
          Browse {careers.length} specialized career paths with full 7-level learning roadmaps, skill requirements, and market insights.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="card glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, skill, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Category:</span>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Level:</span>
          <select
            className="form-control"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Careers Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading career tracks...</div>
      ) : filteredCareers.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <Compass size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3>No matching career tracks found</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Try clearing your search query or filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredCareers.map((career) => {
            const isTarget = user?.targetCareer === career._id || user?.targetCareer?._id === career._id;

            return (
              <div key={career._id} className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {isTarget && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <CheckCircle size={12} /> Active Target
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <span className="badge badge-primary">{career.category}</span>
                  <span className="badge badge-warning">{career.difficulty}</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {career.title}
                </h3>

                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5', flex: 1, marginBottom: '1.25rem' }}>
                  {career.description}
                </p>

                {/* Key Details */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                    <DollarSign size={14} color="#10b981" />
                    <strong>Salary:</strong> {career.averageSalary}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                    <Clock size={14} color="#06b6d4" />
                    <strong>Duration:</strong> {career.estimatedDuration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                    <TrendingUp size={14} color="#818cf8" />
                    <strong>Outlook:</strong> {career.jobOutlook}
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Required Skills ({career.requiredSkills?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {career.requiredSkills?.slice(0, 5).map((skill, idx) => (
                      <span key={idx} style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        color: '#94a3b8',
                      }}>
                        {skill.name || skill}
                      </span>
                    ))}
                    {career.requiredSkills?.length > 5 && (
                      <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>
                        +{career.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <Link to={`/careers/${career._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    View Path
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleSetTargetCareer(career._id, career.title)}
                    className={`btn btn-sm ${isTarget ? 'btn-outline' : 'btn-primary'}`}
                    style={{ flex: 1 }}
                  >
                    <Target size={14} /> {isTarget ? 'Current Target' : 'Set as Target'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CareersList;
