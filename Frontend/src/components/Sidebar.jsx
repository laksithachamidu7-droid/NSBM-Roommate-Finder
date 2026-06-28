import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, User, FileText, Heart, UserPlus, MessageSquare, Settings, Home } from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  // Format user role display
  const userRole = user?.userType === 'owner' ? 'Property Owner' : 'Renter Account';

  return (
    <aside className="sidebar-container-new">
      <div className="sidebar-profile-card-new">
        <div className="sidebar-avatar-small">
          <img 
            src={user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
            alt={user?.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(user?.name?.charAt(0) || 'U');
            }}
          />
        </div>
        <div className="sidebar-profile-info">
          <h3 className="sidebar-profile-name-new">{user?.name}</h3>
          <p className="sidebar-profile-role-new">{userRole}</p>
        </div>
      </div>

      <nav className="sidebar-menu-new">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => `sidebar-link-new ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) => `sidebar-link-new ${isActive ? 'active' : ''}`}
        >
          <User size={18} />
          <span>My Profile</span>
        </NavLink>

        <NavLink 
          to="/dashboard/roommate-ad" 
          className={({ isActive }) => `sidebar-link-new ${isActive ? 'active' : ''}`}
        >
          <FileText size={18} />
          <span>My Roommate Ad</span>
        </NavLink>

        <NavLink 
          to="/dashboard/saved" 
          className={({ isActive }) => `sidebar-link-new ${isActive ? 'active' : ''}`}
        >
          <Heart size={18} />
          <span>Saved Properties</span>
        </NavLink>

        <NavLink 
          to="/dashboard/messages" 
          className={({ isActive }) => `sidebar-link-new ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>Messages</span>
        </NavLink>

        <NavLink 
          to="/dashboard/settings" 
          className={({ isActive }) => `sidebar-link-new ${isActive ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer-new">
        <Link to="/" className="sidebar-home-btn-new">
          <Home size={16} />
          <span>Go to Homepage</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

