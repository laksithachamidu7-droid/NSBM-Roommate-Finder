import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { roommateService } from '../services/roommateService';
import PropertyCard from '../components/PropertyCard';
import RoommateCard from '../components/RoommateCard';
import { Search, MapPin, Users, Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [city, setCity] = useState('');
  const [type, setType] = useState('properties');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propsData = await propertyService.getAllProperties();
        const roommatesData = await roommateService.searchRoommates();
        setProperties(propsData.slice(0, 3));
        setRoommates(roommatesData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (type === 'properties') {
      navigate(`/properties?city=${city}`);
    } else {
      navigate(`/roommates?occupation=${city}`);
    }
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect <span className="text-highlight">Roommate</span> and <span className="text-highlight">Shared Home</span>
          </h1>
          <p className="hero-subtitle">
            Connect with verified roommates, find shared rentals, and list spare rooms in seconds.
          </p>

          <form className="hero-search-bar glass" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <MapPin size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Enter city or occupation filter..." 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-select-wrapper">
              <Users size={20} className="search-icon" />
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="search-select"
              >
                <option value="properties">Find Properties</option>
                <option value="roommates">Find Roommates</option>
              </select>
            </div>

            <button type="submit" className="hero-search-btn">
              <Search size={18} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </header>

      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Browse recently listed shared rentals and apartments.</p>
          </div>
          <Link to="/properties" className="view-all-link">View All Properties →</Link>
        </div>

        {loading ? (
          <div className="loading-placeholder">Loading properties...</div>
        ) : (
          <div className="properties-grid">
            {properties.length > 0 ? (
              properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            ) : (
              <p className="no-listings">No properties listed yet. Be the first to add one!</p>
            )}
          </div>
        )}
      </section>

      <section className="featured-section alternate-bg">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Roommates</h2>
            <p className="section-subtitle">Find people looking for room shares with compatible budgets.</p>
          </div>
          <Link to="/roommates" className="view-all-link">View All Profiles →</Link>
        </div>

        {loading ? (
          <div className="loading-placeholder">Loading roommates...</div>
        ) : (
          <div className="roommates-grid">
            {roommates.length > 0 ? (
              roommates.map(rm => (
                <RoommateCard key={rm.id} ad={rm} />
              ))
            ) : (
              <p className="no-listings">No roommate ads posted yet.</p>
            )}
          </div>
        )}
      </section>

      <section className="how-it-works-section">
        <h2 className="how-title">How It Works</h2>
        <div className="how-grid">
          <div className="how-step glass">
            <div className="how-icon-wrapper">
              <Users size={32} />
            </div>
            <h3>1. Create Profile</h3>
            <p>Sign up, upload a profile picture, and write details about your lifestyle preferences.</p>
          </div>

          <div className="how-step glass">
            <div className="how-icon-wrapper">
              <HomeIcon size={32} />
            </div>
            <h3>2. Search Shared Listings</h3>
            <p>Filter roommate advertisements or rental properties by city, price range, or roommate type.</p>
          </div>

          <div className="how-step glass">
            <div className="how-icon-wrapper">
              <Search size={32} />
            </div>
            <h3>3. Chat & Move In</h3>
            <p>Connect instantly with listing owners using our integrated secure messaging system.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
