import React, { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

const US_MAJOR_CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
  'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
  'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Mesa, AZ',
  'Sacramento, CA', 'Atlanta, GA', 'Kansas City, MO', 'Colorado Springs, CO', 'Omaha, NE',
  'Raleigh, NC', 'Miami, FL', 'Long Beach, CA', 'Virginia Beach, VA', 'Oakland, CA',
  'Minneapolis, MN', 'Tulsa, OK', 'Tampa, FL', 'Arlington, TX', 'New Orleans, LA',
  'Garland, TX', 'Irving, TX', 'Plano, TX', 'Frisco, TX', 'McKinney, TX'
];

const LANGUAGES = [
  'Amharic',
  'English',
  'Tigrinya',
  'Oromo',
  'Somali',
  'Arabic',
  'Spanish',
  'French'
];

const TITLES = [
  'Kesis',
  'Aba'
];

function AddClergyForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    languages: [],
    deber: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    bio: '',
    picture: null
  });

  const [citySearch, setCitySearch] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      return { ...prev, languages };
    });
  };

  const handleCitySearch = (e) => {
    const value = e.target.value;
    setCitySearch(value);
    
    if (value.length > 0) {
      const filtered = US_MAJOR_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = (city) => {
    setCitySearch(city);
    setFormData(prev => ({ ...prev, city }));
    setShowCitySuggestions(false);
  };

  const handlePlaceSelected = (place) => {
    if (place.formatted_address) {
      setFormData(prev => ({ ...prev, address: place.formatted_address }));
      
      const cityComponent = place.address_components?.find(
        component => component.types.includes('locality')
      );
      const stateComponent = place.address_components?.find(
        component => component.types.includes('administrative_area_level_1')
      );
      
      if (cityComponent && stateComponent) {
        const cityState = `${cityComponent.long_name}, ${stateComponent.short_name}`;
        setCitySearch(cityState);
        setFormData(prev => ({ ...prev, city: cityState }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, picture: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.name || !formData.address || !formData.city || formData.languages.length === 0) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('title', formData.title);
      submitData.append('languages', formData.languages.join(', '));
      submitData.append('deber', formData.deber);
      submitData.append('address', formData.address);
      submitData.append('city', formData.city);
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('email', formData.email);
      submitData.append('bio', formData.bio);
      
      if (formData.picture) {
        submitData.append('picture', formData.picture);
      }

      const response = await fetch('/api/clergy/submit', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Clergy member added successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.message || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="bg-white px-6 py-4 rounded-t-lg flex justify-between items-center flex-shrink-0 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-700 flex-grow text-center">Add a Kahin/Priest</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-3xl leading-none absolute right-6"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-grow">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                required
              >
                <option value="">Select a title</option>
                {TITLES.map(title => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Deber/Church
            </label>
            <input
              type="text"
              name="deber"
              value={formData.deber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
              placeholder="e.g., Debre Berhan Kidist Sillase"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Languages <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageToggle(lang)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.languages.includes(lang)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Church Address <span className="text-red-500">*</span>
            </label>
            <Autocomplete
              apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY || ""}
              onPlaceSelected={handlePlaceSelected}
              options={{
                types: ['address'],
                componentRestrictions: { country: 'us' },
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
              placeholder="Start typing address..."
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Please select the closest large city.<br />
              Example: Irving, TX would fall under Dallas, TX<br />
              Example: Reston, VA would fall under Washington, DC
            </p>
            <input
              type="text"
              value={citySearch}
              onChange={handleCitySearch}
              onFocus={() => citySearch && setShowCitySuggestions(true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
              placeholder="Start typing city name..."
              required
            />
            {showCitySuggestions && filteredCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCities.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className="px-4 py-2 hover:bg-forest-green hover:text-white cursor-pointer"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                placeholder="123-456-7890"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
              placeholder="Brief biography or additional information..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-semibold disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClergyForm;
