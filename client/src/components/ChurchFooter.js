import React from 'react';
import { Link } from 'react-router-dom';
import Amharic from './Amharic';

function ChurchFooter() {
  return (
    <footer className="bg-green-primary text-white py-8">
      <div className="max-w-content mx-auto px-4">
        {/* Site Name */}
        <div className="text-center mb-6">
          <p className="text-lg mb-2">
            <Amharic>የማታ አገልግሎት</Amharic> · Nighttime Service
          </p>
          <p className="text-xs text-gray-400">Connecting the EOTC community nationwide</p>
        </div>

        {/* Nav Links */}
        <nav className="flex justify-center gap-6 mb-6 flex-wrap">
          <Link to="/" className="text-sm hover:text-teal-accent transition-colors">
            Home
          </Link>
          <Link to="/nesiha-abat" className="text-sm hover:text-teal-accent transition-colors">
            Nesiha Abat
          </Link>
          <span className="text-sm text-gray-400">Resources</span>
          <span className="text-sm text-gray-400">Events</span>
          <span className="text-sm text-gray-400">About</span>
        </nav>

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-xs text-white/50 max-w-2xl mx-auto leading-relaxed">
            An independent community knowledge resource for EOTC members across the United States. 
            Not endorsed by or affiliated with the Ethiopian Orthodox Tewahedo Church or 
            any of its governing bodies.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ChurchFooter;
