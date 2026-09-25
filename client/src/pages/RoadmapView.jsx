import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Target, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CircularProgress from '../components/CircularProgress';

const RoadmapView = () => {
  const [searchParams] = useSearchParams();
  const careerIdQuery = searchParams.get('careerId');

  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState({});
  const [careersList, setCareersList] = useState([]);
  const [updatingSkill, setUpdatingSkill] = useState(null);

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchRoadmap = async (targetId) => {
    try {
      setLoading(true);
      const url = targetId ? `/roadmaps/user?careerId=${targetId}` : '/roadmaps/user';
      const response = await api.get(url);
      if (response.data.success) {
        setRoadmapData(response.data);
        // Expand first 2 levels by default
        const initialExpanded = {};
        response.data.roadmap?.forEach((stage, idx) => {
          initialExpanded[stage.level] = idx < 2 || !stage.isCompleted;
        });
        setExpandedLevels(initialExpanded);
      }
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(careerIdQuery);

    // Fetch all careers for switcher
    api.get('/careers').then((res) => {
      if (res.data.success) setCareersList(res.data.careers);
    });
  }, [careerIdQuery]);

  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const handleToggleSkill = async (skillName, currentStatus) => {
    try {
      setUpdatingSkill(skillName);
      const newStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
      const progress = newStatus === 'Completed' ? 100 : 0;

      const response = await api.put(`/progress/${encodeURIComponent(skillName)}`, {
        status: newStatus,
        progress,
      });

      if (response.data.success) {
        addToast(`Marked ${skillName} as ${newStatus}!`, 'success');
        // Refresh roadmap
        fetchRoadmap(roadmapData.career?._id);
      }
    } catch (err) {
      addToast('Failed to update skill progress.', 'error');
    } finally {
      setUpdatingSkill(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
        <p>Generating interactive roadmap tree...</p>
      </div>
    );
  }

  if (!roadmapData || !roadmapData.roadmap) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>No roadmap available</h2>
        <p style={{ color: '#94a3b8', margin: '0.75rem 0 1.5rem' }}>Select a target career to generate your personalized learning tree.</p>
        <Link to="/careers" className="btn btn-primary">Browse Careers</Link>
      </div>
    );
  }

  const { career, overallProgress, totalMilestones, completedMilestones, roadmap } = roadmapData;

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Roadmap Header Card */}
      <div className="card glass-panel" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{career?.category}</span>
              <span className="badge badge-warning">{career?.difficulty}</span>
              {roadmapData.isUserTargetCareer && (
                <span className="badge badge-success">Your Active Target</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)', fontWeight: '800', marginBottom: '0.5rem' }}>
              {career?.title} Roadmap
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              Track milestones, check off completed concepts, and level up across all 7 stages.
            </p>
          </div>

          {/* Progress Circular Widget */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <CircularProgress percentage={overallProgress} size={64} strokeWidth={6} color="#6366f1" />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc' }}>
                {completedMilestones} / {totalMilestones}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Milestones Done ({overallProgress}%)</div>
            </div>
          </div>
        </div>

        {/* Switcher & Links */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Switch Path:</span>
            <select
              className="form-control"
              value={career?._id}
              onChange={(e) => fetchRoadmap(e.target.value)}
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              {careersList.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/skill-gap" className="btn btn-secondary btn-sm">
              <Split size={14} /> Gap Analysis
            </Link>
            <Link to="/assessments" className="btn btn-outline btn-sm">
              <CheckSquare size={14} /> Quizzes
            </Link>
          </div>
        </div>
      </div>

      {/* 7-Level Roadmap Tree Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {roadmap.map((stage, idx) => {
          const isExpanded = !!expandedLevels[stage.level];
          const stageCompleted = stage.isCompleted;

          return (
            <div
              key={stage.level || idx}
              className="card glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: stageCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                overflow: 'hidden',
                transition: 'var(--transition)',
              }}
            >
              {/* Stage Accordion Header */}
              <div
                onClick={() => toggleLevel(stage.level)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: stageCompleted ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: stageCompleted ? 'var(--success)' : 'var(--gradient-primary)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {stageCompleted ? <CheckCircle2 size={22} /> : `L${stage.level}`}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.2rem' }}>
                      Level {stage.level}: {stage.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: stageCompleted ? '#10b981' : '#94a3b8', fontWeight: '600' }}>
                    {stage.skills.filter((s) => s.status === 'Completed').length} / {stage.skills.length} Completed
                  </span>
                  {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                </div>
              </div>

              {/* Stage Skills & Content (Expanded) */}
              {isExpanded && (
                <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  {stage.skills.map((item, sIdx) => {
                    const isDone = item.status === 'Completed';

                    return (
                      <div
                        key={sIdx}
                        style={{
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-md)',
                          background: isDone ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                          border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        {/* Skill Checkbox & Description */}
                        <div style={{ display: 'flex', gap: '0.85rem', flex: '1 1 320px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSkill(item.skill, item.status)}
                            disabled={updatingSkill === item.skill}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              marginTop: '0.2rem',
                            }}
                          >
                            {isDone ? (
                              <CheckCircle2 size={24} color="#10b981" />
                            ) : (
                              <Circle size={24} color="#64748b" />
                            )}
                          </button>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: '700', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? '#94a3b8' : '#f8fafc' }}>
                                {item.skill}
                              </h4>
                              <span className={`badge ${isDone ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.72rem' }}>
                                {item.difficulty}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                              {item.description}
                            </p>

                            {/* Learning Resources Links */}
                            {item.resources && item.resources.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Resources:</span>
                                {item.resources.map((res, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.3rem',
                                      fontSize: '0.75rem',
                                      padding: '0.2rem 0.5rem',
                                      borderRadius: '4px',
                                      background: 'rgba(99, 102, 241, 0.1)',
                                      border: '1px solid rgba(99, 102, 241, 0.25)',
                                      color: '#818cf8',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    <BookOpen size={12} /> {res.title} <ExternalLink size={10} />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Button */}
                        <div>
                          <button
                            type="button"
                            onClick={() => handleToggleSkill(item.skill, item.status)}
                            disabled={updatingSkill === item.skill}
                            className={`btn btn-sm ${isDone ? 'btn-outline' : 'btn-secondary'}`}
                            style={{ minWidth: '130px' }}
                          >
                            {isDone ? 'Mark Incomplete' : 'Mark Completed'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RoadmapView;
