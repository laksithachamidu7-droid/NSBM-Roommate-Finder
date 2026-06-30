import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import { MapPin, DollarSign, Bed, Bath, SlidersHorizontal } from 'lucide-react';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(initialCity);
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (city) filters.city = city;
      if (maxRent) filters.maxRent = parseFloat(maxRent);
      if (bedrooms) filters.bedrooms = parseInt(bedrooms);
      if (bathrooms) filters.bathrooms = parseInt(bathrooms);

      const data = await propertyService.getAllProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (city) params.city = city;
    setSearchParams(params);
    fetchProperties();
  };

  return (
    <div className="search-directory-page">
      <div className="directory-header">
        <h2>Find Shared Housing</h2>
        <p>Explore rooms, shared flats, and apartments that suit your lifestyle.</p>
      </div>

      <form onSubmit={handleFilterSubmit} className="directory-filters-bar glass">
        <div className="filter-item">
          <label><MapPin size={16} /> City</label>
          <input 
            type="text" 
            placeholder="e.g. New York" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label><DollarSign size={16} /> Max Rent (LKR)</label>
          <input 
            type="number" 
            placeholder="e.g. 15000" 
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label><Bed size={16} /> Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            <option value="">Any</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4+ Beds</option>
          </select>
        </div>

        <div className="filter-item">
          <label><Bath size={16} /> Bathrooms</label>
          <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
            <option value="">Any</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3+ Baths</option>
          </select>
        </div>

        <button type="submit" className="apply-filters-btn">
          <SlidersHorizontal size={16} />
          <span>Apply</span>
        </button>
      </form>

      {loading ? (
        <div className="loading-placeholder">Searching shared homes...</div>
      ) : properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="no-results-box glass">
          <h3>No housing matches found</h3>
          <p>Try broadening your filters (e.g. searching a different city or increasing your budget).</p>
        </div>
      )}
    </div>
  );
};

export default Properties;
