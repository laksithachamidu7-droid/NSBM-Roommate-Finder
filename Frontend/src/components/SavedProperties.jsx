import React, { useEffect, useState } from 'react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import { Heart } from 'lucide-react';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const data = await propertyService.getSavedProperties();
      setSavedProperties(data);
    } catch (error) {
      console.error("Error loading saved properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleSaveToggle = (propertyId, isSaved) => {
    if (!isSaved) {
      setSavedProperties(savedProperties.filter(item => item.id !== propertyId));
    }
  };

  return (
    <div className="saved-properties-page">
      <div className="page-header">
        <h2>Saved Listings</h2>
        <p>Manage the shared rental listings and spare rooms you've marked as favorites.</p>
      </div>

      {loading ? (
        <div className="loading-placeholder">Loading favorites...</div>
      ) : savedProperties.length > 0 ? (
        <div className="properties-grid">
          {savedProperties.map(prop => (
            <PropertyCard 
              key={prop.id} 
              property={prop} 
              isInitiallySaved={true} 
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="no-listings-box glass">
          <div className="heart-icon-wrapper-large">
            <Heart size={48} color="#ef4444" fill="#ef4444" />
          </div>
          <p>You haven't saved any property listings yet.</p>
          <a href="/properties" className="create-first-link">Explore Shared Rentals</a>
        </div>
      )}
    </div>
  );
};

export default SavedProperties;
