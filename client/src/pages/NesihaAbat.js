import React, { useState, useEffect } from 'react';
import ClergyCard from '../components/ClergyCard';
import AddClergyForm from '../components/AddClergyForm';

function NesihaAbat() {
  const [clergy, setClergy] = useState([]);
  const [filteredClergy, setFilteredClergy] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedChurch, setSelectedChurch] = useState('');
  const [churches, setChurches] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchClergy = () => {
    fetch('/api/clergy')
      .then(res => res.json())
      .then(data => {
        setClergy(data);
        setFilteredClergy(data);
        
        const uniqueChurches = [...new Set(data.map(c => c.church))];
        setChurches(uniqueChurches);
        
        const allLanguages = data.flatMap(c => c.languages);
        const uniqueLanguages = [...new Set(allLanguages)];
        setLanguages(uniqueLanguages);
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
      filtered = filtered.filter(c => c.church === selectedChurch);
    }
    
    setFilteredClergy(filtered);
  }, [selectedLanguage, selectedChurch, clergy]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-medium-green text-center mb-12">
        NESIHA ABAT
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-forest-green mb-4">Welcome</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This is an Orthodox Tewahedo Christian site intended to help the youth or 
            people new to the DFW area find a Nesiha Abat. We encourage you to reach out 
            to the Aba at your church but if that is not possible please feel free to 
            contact them using the provided information.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you'd like to add an Aba and/or Church to our list please reach out to -----
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-forest-green mb-4 amharic-text">ሰላም</h2>
          <p className="text-gray-700 leading-relaxed mb-4 amharic-text">
            ይህ የኦርቶዶክስ ተዋህዶ ክርስቲያን ድረ-ገጽ ለወጣቶች ወይም ለDFW አካባቢ አዲስ ለሆኑ ሰዎች ነሲሃ አባት እንዲያገኙ የተዘጋጀ ነው። 
            በቤተክርስቲያንዎ ካለው አባ ጋር እንዲያነጋግሩ እናበረታታለን ነገር ግን ይህ የማይቻል ከሆነ በተሰጠው መረጃ በመጠቀም ያነጋግሯቸው።
          </p>
          <p className="text-gray-700 leading-relaxed amharic-text">
            አባትን እና/ወይም ቤተክርስቲያንን ወደ ዝርዝራችን ለመጨመር እባክዎ ያነጋግሩን -----
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="appearance-none bg-light-green hover:bg-medium-green text-white font-semibold py-3 px-6 pr-10 rounded-lg cursor-pointer transition-colors"
          >
            <option value="">Select Language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedChurch}
            onChange={(e) => setSelectedChurch(e.target.value)}
            className="appearance-none bg-light-green hover:bg-medium-green text-white font-semibold py-3 px-6 pr-10 rounded-lg cursor-pointer transition-colors"
          >
            <option value="">Select Church</option>
            {churches.map(church => (
              <option key={church} value={church}>{church}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        {(selectedLanguage || selectedChurch) && (
          <button
            onClick={() => {
              setSelectedLanguage('');
              setSelectedChurch('');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredClergy.map(person => (
          <ClergyCard key={person.id} clergy={person} />
        ))}
      </div>

      {filteredClergy.length === 0 && (
        <div className="text-center text-gray-500 text-xl mt-12">
          No clergy found matching your filters. Please try different criteria.
        </div>
      )}

      <div className="flex justify-center mt-16 mb-8">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gold hover:bg-amber text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 text-lg"
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
  );
}

export default NesihaAbat;
