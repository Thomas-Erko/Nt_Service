import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Amharic from './Amharic';

function ChurchHeader() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Main Nav */}
      <div className="max-w-content mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex flex-col">
          <div className="text-2xl font-light">
            <span className="text-gray-800">Nighttime </span>
            <span className="text-teal-accent">Service</span>
          </div>
          <Amharic className="text-xs text-gray-500">የማታ አገልግሎት</Amharic>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              isActive('/') ? 'text-teal-accent' : 'text-gray-600 hover:text-teal-accent'
            }`}
          >
            Home
          </Link>
          <Link
            to="/nesiha-abat"
            className={`text-sm transition-colors ${
              isActive('/nesiha-abat') ? 'text-teal-accent' : 'text-gray-600 hover:text-teal-accent'
            }`}
          >
            Nesiha Abat
          </Link>
          <span className="text-sm text-gray-400 cursor-not-allowed">
            Resources
          </span>
          <span className="text-sm text-gray-400 cursor-not-allowed">
            Events
          </span>
          <span className="text-sm text-gray-400 cursor-not-allowed">
            About
          </span>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default ChurchHeader;
