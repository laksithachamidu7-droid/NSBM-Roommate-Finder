import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Image, AlertCircle, Loader, Briefcase, Upload } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [userType, setUserType] = useState('renter');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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
    setSubmitting(true);

    try {
      await register({ 
        name, 
        email, 
        password, 
        phone, 
        profileImage, 
        userType, 
        companyName: userType === 'owner' ? companyName : '' 
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already be taken.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to find roommates and shared housing listings.</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="user-type-selector">
            <button 
              type="button" 
              className={`type-tab ${userType === 'renter' ? 'active' : ''}`}
              onClick={() => setUserType('renter')}
            >
              Renter
            </button>
            <button 
              type="button" 
              className={`type-tab ${userType === 'owner' ? 'active' : ''}`}
              onClick={() => setUserType('owner')}
            >
              Property Owner
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                id="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (min 6 chars)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                id="phone"
                placeholder="+1 (123) 456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {userType === 'owner' && (
            <div className="form-group">
              <label htmlFor="companyName">Property / Company Name</label>
              <div className="input-with-icon">
                <Briefcase size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="companyName"
                  placeholder="Apex Rentals LLC"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Profile Photo</label>
            <div className="profile-upload-container">
              {profileImage && (
                <div className="profile-upload-preview">
                  <img src={profileImage} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => setProfileImage('')}
                  >
                    Remove
                  </button>
                </div>
              )}
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
                    placeholder="Paste image URL..."
                    value={profileImage && profileImage.startsWith('data:') ? '' : profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="auth-submit-btn">
            {submitting ? (
              <>
                <Loader size={18} className="spin-animation" />
                <span>Signing up...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
