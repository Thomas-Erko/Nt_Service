import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NewHome() {
  const [clergy, setClergy] = useState([]);

  useEffect(() => {
    fetch('/api/clergy')
      .then(res => res.json())
      .then(data => setClergy(data.slice(0, 3)))
      .catch(err => console.error('Error fetching clergy:', err));
  }, []);

  const events = [
    {
      day: '8',
      month: 'APR',
      title: 'Nesiha Abat walk-in hours',
      location: 'Mekanaselam · Garland · 6:30 AM',
      tag: 'Confession'
    },
    {
      day: '12',
      month: 'APR',
      title: 'Tinsae (Easter) Sunday service',
      location: 'Debre Berhan · 9:30 AM',
      tag: 'Feast day'
    },
    {
      day: '19',
      month: 'APR',
      title: 'New members welcome lunch',
      location: 'Wase Gebriel · 11:00 AM',
      tag: 'Community'
    },
    {
      day: '27',
      month: 'APR',
      title: 'Church administration course',
      location: 'Online · 6:00 PM',
      tag: 'Operations'
    }
  ];

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
      {/* Hero Banner */}
      <div className="mx-2 mb-4">
        <div className="bg-hero-dark rounded-2xl p-8 relative overflow-hidden" style={{ minHeight: '280px' }}>
          {/* Decorative circles */}
          <div className="absolute top-10 right-20 w-32 h-32 rounded-full border border-gold-accent opacity-10"></div>
          <div className="absolute bottom-10 right-40 w-20 h-20 rounded-full border border-gold-accent opacity-10"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full" style={{ minHeight: '240px' }}>
            {/* Top content */}
            <div>
              <p className="font-ethiopic text-gold-accent text-xs tracking-widest mb-2">
                የማታ አገልግሎት
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="text-white">Welcome </span>
                <span className="text-gold-accent italic font-serif">home.</span>
              </h1>
              <p className="text-white opacity-70 text-sm mb-6">
                EOTC Community Resource · Nationwide
              </p>
              <Link 
                to="/nesiha-abat"
                className="inline-block bg-green-700 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-green-800 transition-colors"
              >
                Find a Nesiha Abat
              </Link>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-end mt-8">
              {/* Social icons */}
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="bg-green-700 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-green-800 transition-colors">
                  Watch online
                </button>
                <button className="bg-green-800 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-green-900 transition-colors">
                  Plan a visit
                </button>
                <button className="bg-green-950 text-yellow-300 rounded-full px-4 py-2 text-xs font-medium hover:bg-black transition-colors">
                  Give
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="mx-2 mt-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-r-lg p-3">
          <p className="text-xs text-yellow-900">
            <span className="font-bold text-gold-dark">Community resource only.</span> An independent knowledge base for EOTC members — not endorsed by or affiliated with the Ethiopian Orthodox Tewahedo Church or any of its governing bodies.
          </p>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="mx-2 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/nesiha-abat" className="bg-green-800 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-green-900 transition-colors">
          <span className="text-white text-sm font-medium">Nesiha Abat directory</span>
          <div className="w-7 h-7 rounded-full bg-yellow-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <div className="bg-green-800 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-green-900 transition-colors opacity-60">
          <span className="text-white text-sm font-medium">Sermon resources</span>
          <div className="w-7 h-7 rounded-full bg-yellow-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className="bg-green-800 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-green-900 transition-colors opacity-60">
          <span className="text-white text-sm font-medium">Knowledge base</span>
          <div className="w-7 h-7 rounded-full bg-yellow-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className="bg-green-800 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-green-900 transition-colors opacity-60">
          <span className="text-white text-sm font-medium">Church operations</span>
          <div className="w-7 h-7 rounded-full bg-yellow-300 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Next Step Banner */}
      <div className="mx-2 mt-6 bg-green-800 rounded-2xl p-5">
        <h2 className="text-xl font-bold text-white mb-1">
          Take your <span className="italic font-serif">next step</span>
        </h2>
        <p className="text-white opacity-65 text-xs mb-4">
          Everyone has a next step and every step matters.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/nesiha-abat" className="bg-green-700 rounded-xl overflow-hidden hover:bg-green-600 transition-colors">
            <div className="h-16 bg-green-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-white opacity-85 text-xs p-2 text-center">Find a confessor</p>
          </Link>
          <div className="bg-green-700 rounded-xl overflow-hidden opacity-60">
            <div className="h-16 bg-green-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-white opacity-85 text-xs p-2 text-center">Join a community</p>
          </div>
          <div className="bg-green-700 rounded-xl overflow-hidden opacity-60">
            <div className="h-16 bg-green-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-white opacity-85 text-xs p-2 text-center">Learn the faith</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mx-2 mt-6">
        <h2 className="text-2xl font-bold mb-4">
          <span>Upcoming </span>
          <span className="italic font-serif">Events</span>
        </h2>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex gap-4 pb-3 border-b border-gray-200 last:border-0">
              <div className="bg-green-50 rounded-lg p-2 text-center flex-shrink-0" style={{ width: '50px' }}>
                <div className="text-green-800 font-bold text-lg leading-tight">{event.day}</div>
                <div className="text-green-600 text-xs uppercase">{event.month}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                <span className="inline-block mt-1 bg-green-50 text-green-800 text-xs rounded-full px-2 py-0.5">
                  {event.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nesiha Abat Preview */}
      <div className="mx-2 mt-6 mb-8">
        <h2 className="text-lg font-bold tracking-widest text-green-800 mb-1">
          NESIHA ABAT
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Find a spiritual father confessor nationwide
        </p>
        
        <div className="flex gap-3 mb-4">
          <button className="bg-green-800 text-white text-xs rounded-full px-4 py-1.5 hover:bg-green-900 transition-colors">
            Select language ▾
          </button>
          <button className="bg-green-800 text-white text-xs rounded-full px-4 py-1.5 hover:bg-green-900 transition-colors">
            Select church ▾
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {clergy.map((person) => (
            <Link 
              key={person.id} 
              to={`/nesiha-abat/${person.id}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-24 bg-green-100 flex items-center justify-center">
                {person.photoUrl && person.photoUrl !== 'https://via.placeholder.com/400x400?text=No+Image' ? (
                  <img src={person.photoUrl} alt={person.name} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-green-800 text-yellow-300 text-lg font-bold font-ethiopic flex items-center justify-center">
                    {getInitial(person.name)}
                  </div>
                )}
              </div>
              <div className="pt-2 px-2">
                <h3 className="text-sm font-medium text-green-700 text-center">{person.name}</h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {person.languages.join(', ')}
                </p>
                <p className="text-xs text-gray-500 text-center">{person.church}</p>
                <p className="text-xs text-gray-500 text-center">{person.city}</p>
              </div>
              <div className="text-xs text-green-700 text-center py-2">
                Read more →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link 
            to="/nesiha-abat"
            className="inline-block text-sm text-green-700 font-medium hover:text-green-800"
          >
            View all clergy →
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

export default NewHome;
