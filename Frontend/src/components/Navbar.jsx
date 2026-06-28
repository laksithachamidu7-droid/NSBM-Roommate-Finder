import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Users, LogOut, LayoutDashboard, User as UserIcon, MessageSquare, Heart, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text-gradient">NSBM RoomMate</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/properties" className="nav-link">Find Housing</Link>
          <Link to="/roommates" className="nav-link">Find Roommates</Link>
          <Link to="/nsbm-roommate" className="nav-link">+ Post Your Ad</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-menu">
              <Link to="/dashboard" className="nav-dashboard-btn">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <div className="navbar-avatar">
                <img 
                  src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
                  alt={user.name} 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(user.name.charAt(0));
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn-nav">Login</Link>
              <Link to="/register" className="register-btn-nav">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
