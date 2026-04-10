import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-2 pt-3">
      <div className="bg-white rounded-full shadow-sm border border-gray-200 px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo and Site Name */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-green-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-green-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-ethiopic text-green-primary font-bold text-sm leading-tight">
              የማታ አገልግሎት
            </span>
            <span className="text-gray-500 text-[10px] tracking-widest leading-tight">
              NIGHTTIME SERVICE
            </span>
          </div>
        </Link>
        
        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-green-primary' : 'text-gray-600 hover:text-green-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/nesiha-abat" 
            className={`text-sm font-medium transition-colors ${
              isActive('/nesiha-abat') ? 'text-green-primary' : 'text-gray-600 hover:text-green-primary'
            }`}
          >
            Nesiha Abat
          </Link>
          <Link 
            to="/knowledge-base" 
            className={`text-sm font-medium transition-colors ${
              isActive('/knowledge-base') || location.pathname.startsWith('/knowledge-base/') 
                ? 'text-green-primary' 
                : 'text-gray-600 hover:text-green-primary'
            }`}
          >
            Knowledge Base
          </Link>
          <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
            Events
          </span>
        </div>
        
        {/* About Button */}
        <button className="bg-green-800 text-white rounded-full px-4 py-1.5 text-sm font-medium hover:bg-green-900 transition-colors">
          About
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
