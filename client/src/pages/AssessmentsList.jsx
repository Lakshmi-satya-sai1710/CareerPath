import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  Award, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/assessments');
        if (res.data.success) {
          setAssessments(res.data.assessments);
          setFilteredAssessments(res.data.assessments);
        }

        if (isAuthenticated) {
          const resultsRes = await api.get('/assessments/results/me');
          if (resultsRes.data.success) {
            setPastResults(resultsRes.data.results);
          }
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAssessments(assessments);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredAssessments(
        assessments.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.skill.toLowerCase().includes(q) ||
            a.description?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, assessments]);

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Skill Validation</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Skill Assessment Quizzes
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.35rem' }}>
          Test your domain mastery with timed MCQs. Scoring ≥70% automatically updates your verified skill portfolio.
        </p>
      </div>

      {/* Search Bar */}
      <div className="card glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search quizzes by skill (e.g. React, Node.js, Python, MongoDB)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading assessment tests...</div>
      ) : filteredAssessments.length === 0 ? (
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <HelpCircle size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3>No quizzes matched your search</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Try searching for another skill.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredAssessments.map((quiz) => {
            const hasPassed = quiz.hasAttempted && quiz.bestPercentage >= 70;

            return (
              <div key={quiz._id} className="card glass-panel card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-primary">{quiz.skill}</span>
                  <span className="badge badge-warning">{quiz.difficulty}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {quiz.title}
                </h3>

                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', flex: 1, marginBottom: '1.25rem' }}>
                  {quiz.description}
                </p>

                {/* Specs */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckSquare size={14} color="#6366f1" />
                    <span>{quiz.questions?.length || quiz.totalQuestions || 6} Questions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="#06b6d4" />
                    <span>{quiz.durationMinutes || 15} Mins</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Award size={14} color="#10b981" />
                    <span>Pass: 70%</span>
                  </div>
                </div>

                {/* Past Attempt Status */}
                {quiz.hasAttempted && (
                  <div style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: hasPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${hasPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                  }}>
                    <span style={{ color: hasPassed ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                      {hasPassed ? '✓ Passed Assessment' : 'Needs Practice'}
                    </span>
                    <span style={{ fontWeight: '700', color: '#f8fafc' }}>
                      Best: {quiz.bestPercentage}% ({quiz.bestLevel})
                    </span>
                  </div>
                )}

                {/* Start Button */}
                <div style={{ marginTop: 'auto' }}>
                  <Link
                    to={`/assessments/${quiz._id}`}
                    className={`btn btn-block ${quiz.hasAttempted ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {quiz.hasAttempted ? (
                      <>
                        <RotateCcw size={15} /> Retake Quiz
                      </>
                    ) : (
                      <>
                        Start Quiz <ArrowRight size={15} />
                      </>
                    )}
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Past Results History */}
      {pastResults.length > 0 && (
        <div className="card glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
            Your Assessment History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pastResults.map((result) => (
              <div
                key={result._id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{result.skill} Assessment</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Taken on {new Date(result.completedAt || result.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${result.percentage >= 70 ? 'badge-success' : 'badge-danger'}`}>
                    {result.score} / {result.totalQuestions} ({result.percentage}%)
                  </span>
                  <span className="badge badge-info">{result.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AssessmentsList;
