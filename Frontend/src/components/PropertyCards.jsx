import React, { useState, useContext } from 'react';
import { Heart, MapPin, Bed, Bath, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { propertyService } from '../services/propertyService';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property, isInitiallySaved = false, onSaveToggle }) => {
  const { user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await propertyService.unsaveProperty(property.id);
        setIsSaved(false);
        if (onSaveToggle) onSaveToggle(property.id, false);
      } else {
        await propertyService.saveProperty(property.id);
        setIsSaved(true);
        if (onSaveToggle) onSaveToggle(property.id, true);
      }
    } catch (error) {
      console.error("Error saving/unsaving property:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };

  const propertyImages = property.images ? property.images.split('|||').filter(Boolean) : [];
  const coverImage = propertyImages.length > 0 
    ? propertyImages[0] 
    : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="property-card" onClick={handleCardClick}>
      <div className="property-card-image-container">
        <img 
          src={coverImage} 
          alt={property.title}
          className="property-card-img"
        />
        <button 
          onClick={handleSaveToggle} 
          disabled={saving}
          className={`save-property-btn ${isSaved ? 'saved' : ''}`}
        >
          <Heart size={20} fill={isSaved ? "#ef4444" : "none"} color={isSaved ? "#ef4444" : "#fff"} />
        </button>
        <div className="property-card-price">
          LKR {property.rent} <span className="price-unit">/ month</span>
        </div>
      </div>

      <div className="property-card-content">
        <h4 className="property-card-title">{property.title}</h4>
        
        <div className="property-card-location">
          <MapPin size={16} />
          <span>{property.city}, {property.address}</span>
        </div>

        <div className="property-card-features">
          <div className="feature-item">
            <Bed size={16} />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="feature-item">
            <Bath size={16} />
            <span>{property.bathrooms} Bath</span>
          </div>
        </div>

        <div className="property-card-footer">
          <div className="owner-info">
            <div className="owner-avatar">
              <User size={14} />
            </div>
            <span>Listed by {property.owner?.name || 'Owner'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
