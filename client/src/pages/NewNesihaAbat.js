import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddClergyForm from '../components/AddClergyForm';
import { getDriveImageUrl } from '../utils/driveImageUrl';

function NewNesihaAbat() {
  const [clergy, setClergy] = useState([]);
  const [filteredClergy, setFilteredClergy] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedChurch, setSelectedChurch] = useState('');
  // CRITICAL: imageErrors state tracks failed image loads for fallback display
  // DO NOT REMOVE - Required for proper image/initial rendering
  const [imageErrors, setImageErrors] = useState({});
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [churches, setChurches] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [availableChurches, setAvailableChurches] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchClergy = () => {
    console.log('Fetching clergy data...');
    fetch('/api/clergy')
      .then(res => {
        console.log('Clergy API response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Clergy data received:', data.length, 'members');
        console.log('First 3 clergy with photo info:', data.slice(0, 3).map(c => ({
          name: c.name,
          photoUrl: c.photoUrl,
          convertedUrl: getDriveImageUrl(c.photoUrl),
          photoUrlType: typeof c.photoUrl,
          photoUrlLength: c.photoUrl ? c.photoUrl.length : 0
        })));
        
        setClergy(data);
        setFilteredClergy(data);
        
        const uniqueChurches = [...new Set(data.map(c => c.deber))].filter(c => c);
        setChurches(uniqueChurches);
        
        const allLanguages = data.flatMap(c => c.languages);
        const uniqueLanguages = [...new Set(allLanguages)].filter(l => l);
        setLanguages(uniqueLanguages);
        
        // Extract cities and states from city field (format: "City, ST")
        const uniqueCities = [...new Set(data.map(c => c.city))].filter(c => c);
        setCities(uniqueCities);
        
        const uniqueStates = [...new Set(data.map(c => {
          if (c.city && c.city.includes(',')) {
            return c.city.split(',')[1].trim();
          }
          return null;
        }))].filter(s => s);
        setStates(uniqueStates);
      })
      .catch(err => console.error('Error fetching clergy:', err));
  };

  useEffect(() => {
    fetchClergy();
  }, []);

  useEffect(() => {
    let filtered = [...clergy];
    
    if (selectedLanguage) {
      filtered = filtered.filter(c => c.languages.includes(selectedLanguage));
    }
    
    if (selectedChurch) {
      filtered = filtered.filter(c => c.deber === selectedChurch);
    }
    
    if (selectedCity) {
      filtered = filtered.filter(c => c.city === selectedCity);
    }
    
    if (selectedState) {
      filtered = filtered.filter(c => {
        if (c.city && c.city.includes(',')) {
          const state = c.city.split(',')[1].trim();
          return state === selectedState;
        }
        return false;
      });
    }
    
    setFilteredClergy(filtered);
    
    // Update available options based on filtered results (cascading filters)
    const filteredChurches = [...new Set(filtered.map(c => c.deber))].filter(c => c);
    setAvailableChurches(filteredChurches);
    
    const filteredLanguages = [...new Set(filtered.flatMap(c => c.languages))].filter(l => l);
    setAvailableLanguages(filteredLanguages);
    
    const filteredCities = [...new Set(filtered.map(c => c.city))].filter(c => c);
    setAvailableCities(filteredCities);
    
    const filteredStates = [...new Set(filtered.map(c => {
      if (c.city && c.city.includes(',')) {
        return c.city.split(',')[1].trim();
      }
      return null;
    }))].filter(s => s);
    setAvailableStates(filteredStates);
  }, [selectedLanguage, selectedChurch, selectedCity, selectedState, clergy]);

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
      'Wendeson': 'ወ',
      'Menber': 'መ',
      'Thomas': 'ቶ'
    };
    return amharicNames[name] || name.charAt(0);
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mx-2 mt-4">
        <h1 className="text-3xl font-bold tracking-widest text-green-800 mb-3">
          NESIHA ABAT
        </h1>

        {/* Bilingual Welcome Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-xs font-medium text-green-700 mb-1">Welcome</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              This is an Orthodox Tewahedo Christian site to help youth or people 
              find a Nesiha Abat. We encourage reaching out to the Aba at church first. 
              To add an Aba to our list please contact us.
            </p>
          </div>
          <div>
            <h4 className="font-ethiopic text-xs font-medium text-green-700 mb-1">ሰላም</h4>
            <p className="font-ethiopic text-xs text-gray-500 leading-relaxed">
              ይህ የኦርቶዶክስ ተዋህዶ ክርስቲያን ድረ-ገጽ ለወጣቶች ወይም ለሰዎች ነሲሃ አባት እንዲያገኙ የተዘጋጀ ነው። 
              በቤተክርስቲያንዎ ካለው አባ ጋር እንዲያነጋግሩ እናበረታታለን። አባትን ወደ ዝርዝራችን ለመጨመር እባክዎ ያነጋግሩን።
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none bg-green-800 text-white text-xs rounded-full px-4 py-1.5 pr-8 cursor-pointer hover:bg-green-900 transition-colors"
            >
              <option value="">Select language ▾</option>
              {(availableLanguages.length > 0 ? availableLanguages : languages).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedChurch}
              onChange={(e) => setSelectedChurch(e.target.value)}
              className="appearance-none bg-green-800 text-white text-xs rounded-full px-4 py-1.5 pr-8 cursor-pointer hover:bg-green-900 transition-colors"
            >
              <option value="">Select church ▾</option>
              {(availableChurches.length > 0 ? availableChurches : churches).map(church => (
                <option key={church} value={church}>{church}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-green-800 text-white text-xs rounded-full px-4 py-1.5 pr-8 cursor-pointer hover:bg-green-900 transition-colors"
            >
              <option value="">Select city ▾</option>
              {(availableCities.length > 0 ? availableCities : cities).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none bg-green-800 text-white text-xs rounded-full px-4 py-1.5 pr-8 cursor-pointer hover:bg-green-900 transition-colors"
            >
              <option value="">Select state ▾</option>
              {(availableStates.length > 0 ? availableStates : states).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {(selectedLanguage || selectedChurch || selectedCity || selectedState) && (
            <button
              onClick={() => {
                setSelectedLanguage('');
                setSelectedChurch('');
                setSelectedCity('');
                setSelectedState('');
              }}
              className="bg-gray-500 text-white text-xs rounded-full px-4 py-1.5 hover:bg-gray-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Clergy Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {filteredClergy.map((person) => {
            const imageUrl = getDriveImageUrl(person.photoUrl);
            return (
              <Link
                key={person.id}
                to={`/clergy/${person.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-green-100 flex items-center justify-center relative">
                  {/* CRITICAL IMAGE RENDERING LOGIC - DO NOT MODIFY WITHOUT TESTING
                      - Condition: imageUrl && !imageErrors[person.id] ensures fallback on error
                      - onError: MUST update imageErrors state to trigger re-render with fallback
                      - DO NOT use style.display manipulation - causes conflicts with Tailwind
                      - DO NOT use inline styles on fallback div - prevents proper show/hide
                      - Fallback div MUST have 'flex' class for proper centering */}
                  {imageUrl && !imageErrors[person.id] ? (
                    <img 
                      src={imageUrl} 
                      alt={person.name} 
                      className="w-28 h-28 rounded-full object-cover border-3 border-white shadow-lg"
                      onLoad={() => {
                        console.log(`✓ Image loaded for ${person.name}`, imageUrl);
                      }}
                      onError={() => {
                        console.error(`✗ Image failed for ${person.name}`);
                        console.error('Original photoUrl:', person.photoUrl);
                        console.error('Converted imageUrl:', imageUrl);
                        // CRITICAL: Update state to trigger re-render with fallback initial
                        setImageErrors(prev => ({ ...prev, [person.id]: true }));
                      }}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-green-800 text-yellow-300 text-3xl font-bold font-ethiopic flex items-center justify-center border-3 border-white shadow-lg">
                      {getInitial(person.name)}
                    </div>
                  )}
                </div>
                <div className="pt-2 px-2">
                  <h3 className="text-sm font-medium text-green-700 text-center">
                    {person.title ? `${person.title} ${person.name}` : person.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {person.languages.join(', ')}
                  </p>
                  {person.deber && (
                    <p className="text-xs text-gray-600 text-center font-medium">{person.deber}</p>
                  )}
                </div>
                <div className="text-xs text-green-700 text-center py-2 hover:text-green-800">
                  Read more →
                </div>
              </Link>
            );
          })}
        </div>

        {filteredClergy.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-12">
            No clergy found matching your filters. Please try different criteria.
          </div>
        )}

        {/* Add Clergy Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gold-accent hover:bg-gold-dark text-green-900 font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            ➕ Add a Kahin/Priest
          </button>
        </div>

        {showAddForm && (
          <AddClergyForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              fetchClergy();
              setShowAddForm(false);
            }}
          />
        )}
      </div>
      </div>
    </div>
  );
}

export default NewNesihaAbat;
