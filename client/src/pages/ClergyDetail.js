import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriveImageUrl } from '../utils/driveImageUrl';
import ContactFatherForm from '../components/ContactFatherForm';

function ClergyDetail() {
  console.log('ClergyDetail component rendering');
  const { id } = useParams();
  console.log('URL param id:', id);
  const navigate = useNavigate();
  const [clergy, setClergy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect running - Fetching clergy for ID:', id);
    fetch('/api/clergy')
      .then(res => {
        console.log('Fetch response received, status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('All clergy data:', data);
        console.log('Data length:', data.length);
        console.log('Looking for ID:', parseInt(id));
        const person = data.find(c => c.id === parseInt(id));
        console.log('Found person:', person);
        setClergy(person);
        setLoading(false);
        console.log('State updated - loading:', false, 'clergy:', person);
      })
      .catch(err => {
        console.error('Error fetching clergy:', err);
        setLoading(false);
      });
  }, [id]);

  const getInitial = (name) => {
    const amharicNames = {
      'Henok': 'ሄ',
      'Mihret': 'ም',
      'Hawaz': 'ሃ',
      'Fekremariyam': 'ፈ',
      'Aberhet': 'አ',
      'Markos': 'ማ',
      'Admas': 'አ',
      'Andualem': 'አ',
      'Micheal': 'ሚ',
      'Shewa': 'ሸ',
      'Mesfin': 'መ',
      'Thomas': 'ቶ',
    };
    
    const firstName = name.split(' ')[0];
    return amharicNames[firstName] || name.charAt(0);
  };

  console.log('Render check - loading:', loading, 'clergy:', clergy);

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-green-700">Loading...</div>
      </div>
    );
  }

  if (!clergy) {
    console.log('Rendering not found state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Clergy member not found</p>
          <button
            onClick={() => navigate('/nesiha-abat')}
            className="text-green-700 hover:text-green-800"
          >
            ← Back to Nesiha Abat
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering clergy detail for:', clergy.name);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Photo */}
      <div className="bg-gradient-to-b from-green-100 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              {/* CRITICAL IMAGE RENDERING - DO NOT MODIFY WITHOUT TESTING
                  - Uses simple conditional rendering based on photoUrl presence
                  - onError hides failed images to show fallback initial
                  - DO NOT use complex state management here (detail page shows one person)
                  - Fallback div MUST have 'flex' class for proper centering */}
              {getDriveImageUrl(clergy.photoUrl) ? (
                <img
                  src={getDriveImageUrl(clergy.photoUrl)}
                  alt={clergy.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                  onError={(e) => {
                    console.log('Image failed to load, hiding image');
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-green-800 text-yellow-300 text-6xl font-bold font-ethiopic flex items-center justify-center border-4 border-white shadow-xl">
                  {getInitial(clergy.name)}
                </div>
              )}
            </div>

            {/* Name and Basic Info */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
                {clergy.title ? `${clergy.title} ${clergy.name}` : clergy.name}
              </h1>
              <div className="space-y-2">
                <p className="text-lg text-gray-600">
                  {clergy.languages.join(', ')}
                </p>
                {clergy.city && (
                  <p className="text-lg text-gray-600">
                    {clergy.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Info Cards */}
          <div className="space-y-6">
            {/* Deber Card */}
            {clergy.deber && (
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-700">
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                  Deber/Church
                </h3>
                <p className="text-lg text-gray-800">{clergy.deber}</p>
              </div>
            )}

            {/* Languages Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-700">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {clergy.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Church Address Card */}
            {(clergy.address || clergy.city) && (
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-700">
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                  Church Address
                </h3>
                {clergy.address && (
                  <p className="text-gray-800">{clergy.address}</p>
                )}
                {clergy.city && (
                  <p className="text-gray-800 font-medium">{clergy.city}</p>
                )}
              </div>
            )}

            {/* Bio Card */}
            {clergy.bio && (
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-700">
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {clergy.bio}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Contact Form Only */}
          <div className="space-y-6">
            {/* Contact This Father Form */}
            <ContactFatherForm clergyName={clergy.name} clergyId={clergy.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClergyDetail;
