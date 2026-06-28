import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);

  // States for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="settings-page-container">
      {/* Settings Header Area */}
      <div className="settings-header-container">
        <div className="settings-title-info">
          <h2 className="settings-page-title">Settings</h2>
          <p className="settings-page-subtitle">Welcome back, {user?.name || 'User'}!</p>
        </div>
        <div className="settings-header-actions">
          <button className="settings-bell-btn">
            <Bell size={20} />
            <span className="settings-bell-badge"></span>
          </button>
          <div className="settings-avatar">
            <img 
              src={user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
              alt={user?.name || 'User'}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(user?.name?.charAt(0) || 'U');
              }}
            />
          </div>
        </div>
      </div>

      {/* Settings Options Grid/List */}
      <div className="settings-list-container">
        {/* Email Notifications */}
        <div className="settings-card-item">
          <div className="settings-card-content">
            <h4 className="settings-item-title">Email Notifications</h4>
            <p className="settings-item-description">Receive emails for new messages and matches</p>
          </div>
          <div className="settings-card-action">
            <label className="toggle-switch-new">
              <input 
                type="checkbox" 
                checked={emailNotifications} 
                onChange={(e) => setEmailNotifications(e.target.checked)} 
              />
              <span className="toggle-slider-new"></span>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="settings-card-item">
          <div className="settings-card-content">
            <h4 className="settings-item-title">Push Notifications</h4>
            <p className="settings-item-description">Get browser push notifications</p>
          </div>
          <div className="settings-card-action">
            <label className="toggle-switch-new">
              <input 
                type="checkbox" 
                checked={pushNotifications} 
                onChange={(e) => setPushNotifications(e.target.checked)} 
              />
              <span className="toggle-slider-new"></span>
            </label>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="settings-card-item">
          <div className="settings-card-content">
            <h4 className="settings-item-title">Profile Visibility</h4>
            <p className="settings-item-description">Make your profile visible to other users</p>
          </div>
          <div className="settings-card-action">
            <label className="toggle-switch-new">
              <input 
                type="checkbox" 
                checked={profileVisibility} 
                onChange={(e) => setProfileVisibility(e.target.checked)} 
              />
              <span className="toggle-slider-new"></span>
            </label>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="settings-card-item">
          <div className="settings-card-content">
            <h4 className="settings-item-title">Two-Factor Authentication</h4>
            <p className="settings-item-description">Add extra security to your account</p>
          </div>
          <div className="settings-card-action">
            <label className="toggle-switch-new">
              <input 
                type="checkbox" 
                checked={twoFactorAuth} 
                onChange={(e) => setTwoFactorAuth(e.target.checked)} 
              />
              <span className="toggle-slider-new"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
