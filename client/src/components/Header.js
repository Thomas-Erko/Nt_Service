import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold">
              <span className="text-forest-green amharic-text">የማታ አገልግሎት</span>
              <span className="text-forest-green mx-2">/</span>
              <span className="text-forest-green">Nighttime Service</span>
            </div>
          </Link>
          
          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-forest-green border-b-2 border-forest-green'
                  : 'text-gray-700 hover:text-forest-green'
              }`}
            >
              Home
            </Link>
            <Link
              to="/nesiha-abat"
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/nesiha-abat'
                  ? 'text-forest-green border-b-2 border-forest-green'
                  : 'text-gray-700 hover:text-forest-green'
              }`}
            >
              Nesiha Abat
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
