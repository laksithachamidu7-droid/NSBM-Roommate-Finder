import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Bed, Bath, Heart, MessageSquare, ChevronLeft } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);

        if (user) {
          const savedList = await propertyService.getSavedProperties();
          const found = savedList.some(item => item.id === data.id);
          setIsSaved(found);
        }
      } catch (error) {
        console.error("Error loading property detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await propertyService.unsaveProperty(property.id);
        setIsSaved(false);
      } else {
        await propertyService.saveProperty(property.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleContactOwner = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/dashboard/messages?userId=${property.owner.id}`);
  };

  if (loading) {
    return <div className="loading-placeholder">Loading property details...</div>;
  }

  if (!property) {
    return (
      <div className="error-view glass">
        <h3>Property listing not found</h3>
        <Link to="/properties" className="back-btn"><ChevronLeft size={16} /> Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <button onClick={() => navigate(-1)} className="back-navigation-btn">
        <ChevronLeft size={16} />
        <span>Back</span>
      </button>

      <div className="detail-layout">
        <div className="detail-main-content">
          {(() => {
            const propertyImages = property.images ? property.images.split('|||').filter(Boolean) : [];
            const mainImage = propertyImages.length > 0 
              ? propertyImages[activeImageIndex] 
              : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80';

            return (
              <div className="detail-image-gallery glass">
                <div className="detail-main-image-container">
                  <img 
                    src={mainImage} 
                    alt={property.title} 
                    className="detail-main-img"
                  />
                </div>
                {propertyImages.length > 1 && (
                  <div className="detail-gallery-thumbnails">
                    {propertyImages.map((img, idx) => (
                      <button 
                        key={idx} 
                        type="button"
                        className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <div className="detail-info-block glass">
            <div className="title-price-row">
              <h2>{property.title}</h2>
              <span className="detail-price">LKR {property.rent} <span className="unit">/ month</span></span>
            </div>

            <div className="detail-location">
              <MapPin size={18} />
              <span>{property.address}, {property.city}</span>
            </div>

            <div className="detail-specs-row">
              <div className="spec-badge">
                <Bed size={20} />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="spec-badge">
                <Bath size={20} />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{property.description || "No description provided by listing owner."}</p>
            </div>
          </div>
        </div>

        <div className="detail-sidebar-actions">
          <div className="owner-action-card glass">
            <h3>Contact Lister</h3>
            <div className="owner-profile-preview">
              <div className="owner-avatar-large">
                <img 
                  src={property.owner?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
                  alt={property.owner?.name} 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(property.owner?.name?.charAt(0));
                  }}
                />
              </div>
              <h4>{property.owner?.name}</h4>
              <p>{property.owner?.email}</p>
              {property.owner?.phone && <p className="phone-text">{property.owner.phone}</p>}
            </div>

            <div className="sidebar-action-buttons">
              {user?.id !== property.owner?.id ? (
                <>
                  <button onClick={handleContactOwner} className="primary-contact-btn">
                    <MessageSquare size={18} />
                    <span>Send Message</span>
                  </button>

                  <button 
                    onClick={handleSaveToggle} 
                    disabled={saving} 
                    className={`secondary-save-btn ${isSaved ? 'saved' : ''}`}
                  >
                    <Heart size={18} fill={isSaved ? "#ef4444" : "none"} color={isSaved ? "#ef4444" : "currentColor"} />
                    <span>{isSaved ? "Saved to Favorites" : "Save to Favorites"}</span>
                  </button>
                </>
              ) : (
                <div className="own-listing-badge-container">
                  <span className="own-listing-badge">This is your listing</span>
                  <Link to={`/dashboard/edit-property/${property.id}`} className="edit-own-listing-btn">Edit Listing</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
