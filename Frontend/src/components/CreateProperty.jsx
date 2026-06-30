import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Save, AlertCircle, Loader, PlusCircle, Upload, Image } from 'lucide-react';

const CreateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [rent, setRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [images, setImages] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        setLoading(true);
        try {
          const data = await propertyService.getPropertyById(id);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setAddress(data.address || '');
          setCity(data.city || '');
          setRent(data.rent || '');
          setBedrooms(data.bedrooms || '');
          setBathrooms(data.bathrooms || '');
          if (data.images) {
            setImages(data.images.split('|||').filter(Boolean));
          } else {
            setImages([]);
          }
        } catch (err) {
          console.error("Error loading property for editing:", err);
          setError("Could not retrieve property listing details.");
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        setError('Each image must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim() !== '') {
      setImages(prev => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      title,
      description,
      address,
      city,
      rent: parseFloat(rent),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      images: images.join('|||')
    };

    try {
      if (id) {
        await propertyService.updateProperty(id, payload);
      } else {
        await propertyService.createProperty(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing listing details. Verify fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-placeholder">Loading property data...</div>;
  }

  return (
    <div className="create-property-page">
      <div className="page-header">
        <h2>{id ? "Edit Property Listing" : "List a Property"}</h2>
        <p>Offer a room, flat share, or full apartment to our community of verified roommates.</p>
      </div>

      {error && (
        <div className="profile-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="roommate-ad-form glass">
        <div className="ad-form-header">
          <PlusCircle size={20} color="#3b82f6" />
          <h3>Property Specifications</h3>
        </div>

        <div className="form-grid">
          <div className="form-group span-2">
            <label htmlFor="propTitle">Listing Title</label>
            <input 
              type="text" 
              id="propTitle" 
              placeholder="e.g. Cozy Bedroom in 3-Bed Downtown Flat" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propCity">City</label>
            <input 
              type="text" 
              id="propCity" 
              placeholder="e.g. New York" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propAddress">Street Address</label>
            <input 
              type="text" 
              id="propAddress" 
              placeholder="e.g. 123 Broadway Ave" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propRent">Monthly Rent (LKR)</label>
            <input 
              type="number" 
              id="propRent" 
              placeholder="e.g. 750" 
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propBedrooms">Bedrooms</label>
            <input 
              type="number" 
              id="propBedrooms" 
              placeholder="e.g. 2" 
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              min={1}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propBathrooms">Bathrooms</label>
            <input 
              type="number" 
              id="propBathrooms" 
              placeholder="e.g. 1" 
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              min={1}
              required
            />
          </div>

          <div className="form-group span-2">
            <label htmlFor="propDesc">Detailed Description</label>
            <textarea 
              id="propDesc" 
              rows="5"
              placeholder="Detail building utilities, neighborhood, transit accessibility, roommate personalities, and rules..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group span-2">
            <label>Property Photos</label>
            <div className="profile-upload-container">
              {images.length > 0 && (
                <div className="property-images-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="property-image-preview-card">
                      <img src={img} alt={`Preview ${idx + 1}`} />
                      <button 
                        type="button" 
                        className="remove-preview-btn" 
                        onClick={() => handleRemoveImage(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="profile-upload-actions">
                <input 
                  type="file" 
                  id="propFiles" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="upload-btn-secondary"
                  onClick={() => document.getElementById('propFiles').click()}
                >
                  <Upload size={16} />
                  Upload Photos
                </button>
                <span className="upload-divider">or</span>
                <div className="input-with-icon flex-grow">
                  <Image size={18} className="input-icon" />
                  <input 
                    type="url" 
                    placeholder="Paste image URL and click Add..." 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="add-url-btn" 
                    onClick={handleAddUrl}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions-row">
          <button type="submit" disabled={submitting} className="profile-save-btn">
            {submitting ? (
              <Loader size={18} className="spin-animation" />
            ) : (
              <Save size={18} />
            )}
            <span>{id ? "Save Changes" : "Post Property"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
