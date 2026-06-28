import React, { useEffect, useState, useContext } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, Image, Lock, Mail, CheckCircle, AlertCircle, Loader, Upload } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setName(data.name || '');
        setPhone(data.phone || '');
        setProfileImage(data.profileImage || '');
        setEmail(data.email || '');
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Could not load profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image file must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const payload = { name, phone, profileImage };
      if (password.trim() !== '') {
        payload.password = password;
      }
      const updated = await authService.updateProfile(payload);
      updateUser(updated);
      setSuccess("Profile updated successfully!");
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-placeholder">Loading profile...</div>;
  }

  return (
    <div className="profile-page-content">
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Update your personal information, profile photo, and password details.</p>
      </div>

      {success && (
        <div className="profile-success-alert">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="profile-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-edit-form glass">
        <div className="profile-avatar-preview-section">
          <div className="profile-preview-avatar">
            <img 
              src={profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
              alt={name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=" + encodeURIComponent(name?.charAt(0) || 'U');
              }}
            />
          </div>
          <div>
            <h4>Profile Photo</h4>
            <p>Upload a photo or paste a public image URL to customize your avatar.</p>
          </div>
        </div>

        <hr className="form-divider" />

        <div className="form-grid">
          <div className="form-group">
            <label>Email Address (Read-only)</label>
            <div className="input-with-icon disabled">
              <Mail size={18} className="input-icon" />
              <input type="email" value={email} disabled />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="profileName">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                id="profileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="profilePhone">Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                id="profilePhone"
                placeholder="+1 (123) 456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group span-2">
            <label>Profile Photo</label>
            <div className="profile-upload-container">
              <div className="profile-upload-actions">
                <input 
                  type="file" 
                  id="profileFile" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="upload-btn-secondary"
                  onClick={() => document.getElementById('profileFile').click()}
                >
                  <Upload size={16} />
                  Upload Photo
                </button>
                <span className="upload-divider">or</span>
                <div className="input-with-icon flex-grow">
                  <Image size={18} className="input-icon" />
                  <input 
                    type="url" 
                    id="profilePhotoUrl"
                    placeholder="Paste image URL..."
                    value={profileImage && profileImage.startsWith('data:') ? '' : profileImage}
                    onChange={(e) => setProfileImage(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group span-2">
            <label htmlFor="profilePassword">Change Password (Leave blank to keep current)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                id="profilePassword"
                placeholder="Enter new password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="profile-save-btn">
          {submitting ? (
            <>
              <Loader size={18} className="spin-animation" />
              <span>Saving changes...</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
