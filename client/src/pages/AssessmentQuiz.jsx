import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Map
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AssessmentQuiz = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/assessments/${id}`);
        if (res.data.success) {
          setAssessment(res.data.assessment);
          setTimeLeft((res.data.assessment.durationMinutes || 15) * 60);
        }
      } catch (err) {
        console.error('Failed to load assessment:', err);
        addToast('Failed to load quiz.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (submissionResult || timeLeft <= 0 || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submissionResult, loading]);

  const handleSelectOption = (optionIndex) => {
    if (submissionResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || submissionResult) return;

    try {
      setIsSubmitting(true);
      const totalQ = assessment.questions.length;
      const formattedAnswers = [];
      for (let i = 0; i < totalQ; i++) {
        formattedAnswers.push(selectedAnswers[i] !== undefined ? selectedAnswers[i] : null);
      }

      const res = await api.post(`/assessments/${id}/submit`, {
        answers: formattedAnswers,
      });

      if (res.data.success) {
        setSubmissionResult(res.data.result);
        if (res.data.result.percentage >= 70) {
          addToast(`Congratulations! You passed the ${assessment.skill} assessment!`, 'success');
        } else {
          addToast(`Quiz submitted. Score: ${res.data.result.percentage}%`, 'info');
        }
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      addToast('Failed to submit assessment answers.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#5D706B' }}>
        <p>Loading assessment questions...</p>
      </div>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: '#063B32' }}>Assessment questions unavailable</h2>
        <Link to="/assessments" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Assessments
        </Link>
      </div>
    );
  }

  const questions = assessment.questions;
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // -------------------------------------------------------------
  // POST-SUBMISSION RESULTS VIEW
  // -------------------------------------------------------------
  if (submissionResult) {
    const passed = submissionResult.percentage >= 70;

    return (
      <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px' }}>
        
        {/* Result Summary Banner */}
        <div className="card" style={{
          padding: '2.5rem',
          borderRadius: '20px',
          textAlign: 'center',
          background: passed
            ? 'linear-gradient(135deg, #063B32 0%, #159447 100%)'
            : 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 10px 25px rgba(6, 59, 50, 0.15)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            color: '#FFFFFF',
          }}>
            {passed ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.35rem', color: '#FFFFFF' }}>
            {passed ? 'Assessment Passed!' : 'Assessment Completed'}
          </h1>
          <p style={{ color: '#EEF8F2', fontSize: '1rem', marginBottom: '1.75rem', opacity: 0.95 }}>
            {passed
              ? `Skill verified! You achieved proficiency in ${assessment.skill}. Your roadmap & profile have been updated.`
              : `You scored ${submissionResult.percentage}%. Review the questions below to strengthen your gaps and try again.`}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            maxWidth: '480px',
            margin: '0 auto 2rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#EEF8F2' }}>Score</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF' }}>
                {submissionResult.score} / {submissionResult.totalQuestions}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '40px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: '#EEF8F2' }}>Percentage</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#FFFFFF' }}>
                {submissionResult.percentage}%
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '40px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: '#EEF8F2' }}>Proficiency</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginTop: '0.2rem' }}>
                {submissionResult.level}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/assessments" className="btn btn-secondary" style={{ background: '#FFFFFF', color: '#063B32', border: 'none' }}>
              Back to Assessments
            </Link>
            <Link to="/roadmap" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)' }}>
              <Map size={16} /> View Roadmap Progress
            </Link>
          </div>
        </div>

        {/* Question Review Breakdown */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#063B32', marginBottom: '1.5rem' }}>
            Detailed Question Explanations
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {submissionResult.answers?.map((ans, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: ans.isCorrect ? '#EEF8F2' : '#FEF2F2',
                  border: `1px solid ${ans.isCorrect ? '#BDE0CB' : '#FECACA'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {ans.isCorrect ? (
                    <CheckCircle2 size={18} color="#159447" />
                  ) : (
                    <XCircle size={18} color="#DC2626" />
                  )}
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#063B32' }}>
                    Q{idx + 1}: {ans.questionText}
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {ans.options?.map((opt, optIdx) => {
                    const isSelected = ans.selectedOption === optIdx;
                    const isCorrect = ans.correctAnswer === optIdx;

                    let bg = '#FFFFFF';
                    let border = '#D9E9DF';
                    let color = '#5D706B';

                    if (isCorrect) {
                      bg = '#EEF8F2';
                      border = '#159447';
                      color = '#159447';
                    } else if (isSelected && !ans.isCorrect) {
                      bg = '#FEF2F2';
                      border = '#DC2626';
                      color = '#DC2626';
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          background: bg,
                          border: `1px solid ${border}`,
                          color,
                          fontSize: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontWeight: isCorrect || isSelected ? '600' : '400',
                        }}
                      >
                        <span>{opt}</span>
                        {isCorrect && <span style={{ fontWeight: '700', fontSize: '0.75rem' }}>✓ Correct Answer</span>}
                        {isSelected && !ans.isCorrect && <span style={{ fontWeight: '700', fontSize: '0.75rem' }}>✗ Your Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {ans.explanation && (
                  <div style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '6px',
                    background: '#FFFFFF',
                    border: '1px solid #D9E9DF',
                    fontSize: '0.82rem',
                    color: '#5D706B',
                  }}>
                    <strong style={{ color: '#063B32' }}>Explanation: </strong>
                    {ans.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE QUIZ RUNNER VIEW
  // -------------------------------------------------------------
  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      
      {/* Top Controls Bar */}
      <div className="card" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/assessments" style={{ color: '#5D706B', display: 'flex' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#063B32' }}>
              {assessment.title}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#5D706B' }}>
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: timeLeft < 120 ? '#FEF2F2' : '#EEF8F2',
          border: `1px solid ${timeLeft < 120 ? '#FECACA' : '#BDE0CB'}`,
          color: timeLeft < 120 ? '#DC2626' : '#159447',
          fontWeight: '700',
          fontSize: '0.9rem',
        }}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar & Question Step Bubbles */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {questions.map((_, qIdx) => {
          const isCurrent = currentIndex === qIdx;
          const isAnswered = selectedAnswers[qIdx] !== undefined;

          let bg = '#FFFFFF';
          let border = '#D9E9DF';
          let color = '#5D706B';

          if (isCurrent) {
            bg = '#159447';
            border = '#159447';
            color = '#FFFFFF';
          } else if (isAnswered) {
            bg = '#EEF8F2';
            border = '#BDE0CB';
            color = '#159447';
          }

          return (
            <button
              key={qIdx}
              type="button"
              onClick={() => setCurrentIndex(qIdx)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: bg,
                border: `1px solid ${border}`,
                color,
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {qIdx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge badge-primary">{assessment.skill}</span>
          <span style={{ fontSize: '0.82rem', color: '#5D706B' }}>
            {answeredCount} of {totalQuestions} answered
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.5', color: '#063B32' }}>
          {currentQ.questionText}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentQ.options?.map((optionText, optIdx) => {
            const isSelected = selectedAnswers[currentIndex] === optIdx;

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? '#EEF8F2' : '#FFFFFF',
                  border: isSelected ? '2px solid #159447' : '1px solid #D9E9DF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#159447' : '#D9E9DF'}`,
                  background: isSelected ? '#159447' : '#F8FCF9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#FFFFFF' : '#5D706B',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span style={{ fontSize: '0.95rem', color: isSelected ? '#063B32' : '#12332D', fontWeight: isSelected ? '700' : '400' }}>
                  {optionText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #D9E9DF',
        }}>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn btn-secondary"
            style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="btn btn-primary"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Scoring Answers...' : 'Submit Quiz'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default AssessmentQuiz;
