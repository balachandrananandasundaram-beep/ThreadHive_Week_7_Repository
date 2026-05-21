import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser({ ...user, ...form });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="profile-initial">{initial}</span>
          </div>
          <div>
            <p className="profile-name">{user?.name || 'User'}</p>
            <p className="profile-email">{user?.email || ''}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-back" onClick={() => navigate('/home')}>
            ← Back to Home
          </button>
          <button className="btn-edit" onClick={() => setEditing((prev) => !prev)}>
            ✏️ Edit Profile
          </button>
        </div>

        {editing ? (
          <div className="profile-form">
            <div className="profile-field">
              <label className="profile-label">Name</label>
              <input
                className="profile-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Email</label>
              <input
                className="profile-input"
                type="email"
                name="email"
                value={form.email}
                disabled
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Bio</label>
              <input
                className="profile-input"
                type="text"
                name="bio"
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Location</label>
              <input
                className="profile-input"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label className="profile-label">Website</label>
              <input
                className="profile-input"
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <div className="profile-form-actions">
              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-label">Name</span>
              <span className="profile-value">{user?.name}</span>
            </div>

            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user?.email}</span>
            </div>

            <div className="profile-field">
              <span className="profile-label">Bio</span>
              <span className="profile-value">{user?.bio}</span>
            </div>

            <div className="profile-field">
              <span className="profile-label">Location</span>
              <span className="profile-value">{user?.location}</span>
            </div>

            <div className="profile-field">
              <span className="profile-label">Website</span>
              <span className="profile-value">{user?.website}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
