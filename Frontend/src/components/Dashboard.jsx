import React, { useEffect, useState, useContext } from 'react';
import { dashboardService } from '../services/dashboardService';
import { propertyService } from '../services/propertyService';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit3, Plus, Home as HomeIcon, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalProperties: 0, totalRoommates: 0, totalMessages: 0 });
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsData = await dashboardService.getStats();
      setStats(statsData);

      const allProps = await propertyService.getAllProperties();
      const userProps = allProps.filter(p => p.owner && p.owner.email === user?.email);
      setMyProperties(userProps);
    } catch (error) {
      console.error("Error fetching dashboard statistics or properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property listing?")) {
      try {
        await propertyService.deleteProperty(id);
        setMyProperties(myProperties.filter(p => p.id !== id));
        const statsData = await dashboardService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  return (
    <div className="dashboard-content-area">
      <div className="dashboard-welcome">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {user?.name}! Here is a snapshot of the NSBM RoomMate network.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon-wrapper blue">
            <HomeIcon size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.totalProperties}</span>
            <span className="stat-label">Total Properties</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon-wrapper green">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.totalRoommates}</span>
            <span className="stat-label">Roommate Ads</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon-wrapper purple">
            <MessageSquare size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.totalMessages}</span>
            <span className="stat-label">Messages Exchanged</span>
          </div>
        </div>
      </div>

      <div className="my-listings-section">
        <div className="section-title-bar">
          <h3>Your Property Listings</h3>
          <Link to="/dashboard/create-property" className="add-listing-btn">
            <Plus size={16} />
            <span>Add Property</span>
          </Link>
        </div>

        {loading ? (
          <div className="loading-placeholder">Loading listings...</div>
        ) : myProperties.length > 0 ? (
          <div className="dashboard-properties-list">
            {myProperties.map(prop => (
              <div key={prop.id} className="dashboard-property-row glass">
                <div className="row-details">
                  <h4>{prop.title}</h4>
                  <p>{prop.city} — {prop.address}</p>
                  <span className="row-rent">LKR {prop.rent} / month</span>
                </div>
                <div className="row-actions">
                  <Link to={`/dashboard/edit-property/${prop.id}`} className="edit-action-btn">
                    <Edit3 size={18} />
                  </Link>
                  <button onClick={() => handleDeleteProperty(prop.id)} className="delete-action-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings-box glass">
            <p>You haven't posted any properties for rent yet.</p>
            <Link to="/dashboard/create-property" className="create-first-link">List Your First Property Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
