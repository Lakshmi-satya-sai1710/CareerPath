import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  BookOpen, 
  GraduationCap, 
  Phone, 
  Github, 
  Linkedin, 
  FileText, 
  Target, 
  Plus, 
  X, 
  Check, 
  Sparkles,
  Save
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    graduationYear: '',
    education: '',
    phone: '',
    bio: '',
    github: '',
    linkedin: '',
    resume: '',
    targetCareer: '',
  });

  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [careers, setCareers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        college: user.college || '',
        graduationYear: user.graduationYear || '',
        education: user.education || '',
        phone: user.phone || '',
        bio: user.bio || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        resume: user.resume || '',
        targetCareer: user.targetCareer?._id || user.targetCareer || '',
      });
      setSkills(user.skills || []);
    }

    api.get('/skills').then((res) => {
      if (res.data.success) setAvailableSkills(res.data.skills);
    });

    api.get('/careers').then((res) => {
      if (res.data.success) setCareers(res.data.careers);
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = async (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (!trimmed || skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) return;

    try {
      const res = await api.put('/users/skills', {
        action: 'add',
        skill: trimmed,
      });
      if (res.data.success) {
        setSkills(res.data.skills);
        updateUserState(res.data.user);
        setNewSkillInput('');
        addToast(`Added "${trimmed}" to your profile!`, 'success');
      }
    } catch (err) {
      addToast('Failed to add skill.', 'error');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const res = await api.put('/users/skills', {
        action: 'remove',
        skill: skillToRemove,
      });
      if (res.data.success) {
        setSkills(res.data.skills);
        updateUserState(res.data.user);
        addToast(`Removed "${skillToRemove}"`, 'info');
      }
    } catch (err) {
      addToast('Failed to remove skill.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        updateUserState(res.data.user);
        addToast('Profile saved successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update profile details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      
      {/* Header */}
      <div>
        <span className="section-tag">PERSONAL SETTINGS</span>
        <h1 className="section-title">
          Profile & Skill Portfolio
        </h1>
        <p className="section-subtitle" style={{ marginTop: '0.35rem' }}>
          Keep your skills and academic information updated to receive precise roadmap recommendations.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Basic Info Card */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', borderBottom: '1px solid #D9E9DF', paddingBottom: '0.75rem' }}>
            Personal & Academic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                disabled
                style={{ background: '#F8FCF9', color: '#5D706B' }}
              />
            </div>

            <div>
              <label className="form-label">College / University</label>
              <input
                type="text"
                name="college"
                className="form-control"
                placeholder="e.g. Stanford University"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                className="form-control"
                placeholder="2026"
                value={formData.graduationYear}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">Degree / Major</label>
              <input
                type="text"
                name="education"
                className="form-control"
                placeholder="B.Tech Computer Science"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Target Career Track</label>
            <select
              name="targetCareer"
              className="form-control"
              value={formData.targetCareer}
              onChange={handleChange}
            >
              <option value="">-- Select Target Career --</option>
              {careers.map((c) => (
                <option key={c._id} value={c._id}>{c.title} ({c.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Short Bio / Summary</label>
            <textarea
              name="bio"
              className="form-control"
              rows={3}
              placeholder="Aspiring full-stack engineer passionate about distributed systems and React UI architecture..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Links Card */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', borderBottom: '1px solid #D9E9DF', paddingBottom: '0.75rem' }}>
            Social & Portfolio Profiles
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                name="github"
                className="form-control"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                className="form-control"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Resume / Portfolio Link</label>
              <input
                type="url"
                name="resume"
                className="form-control"
                placeholder="https://myresume.pdf or Google Drive link"
                value={formData.resume}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Manage Skills Card */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#063B32', borderBottom: '1px solid #D9E9DF', paddingBottom: '0.75rem' }}>
            Verified & Acquired Skills ({skills.length})
          </h2>

          {/* Current Skills Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map((skill, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#EEF8F2',
                  border: '1px solid #BDE0CB',
                  color: '#159447',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {skills.length === 0 && (
              <p style={{ color: '#5D706B', fontSize: '0.85rem' }}>No skills added yet. Add your current skills below or complete quizzes.</p>
            )}
          </div>

          {/* Add New Skill Input */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add a new skill (e.g. Docker, TypeScript, GraphQL)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="btn btn-secondary"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Quick Add Suggestions */}
          {availableSkills.length > 0 && (
            <div>
              <span style={{ fontSize: '0.78rem', color: '#839791', fontWeight: '700', textTransform: 'uppercase' }}>Popular Suggestions:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                {availableSkills.slice(0, 10).map((s) => {
                  const sName = s.name || s;
                  const alreadyHas = skills.map(x => x.toLowerCase()).includes(sName.toLowerCase());
                  if (alreadyHas) return null;

                  return (
                    <button
                      key={s._id || sName}
                      type="button"
                      onClick={() => handleAddSkill(sName)}
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: '#F8FCF9',
                        border: '1px solid #D9E9DF',
                        color: '#5D706B',
                        cursor: 'pointer',
                      }}
                    >
                      + {sName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg btn-block"
          >
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default Profile;
