import React, { useState } from 'react';

function ClergyCard({ clergy }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-200">
        <img
          src={clergy.photoUrl}
          alt={clergy.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-medium-green mb-3">
          {clergy.name}
        </h3>
        
        <div className="space-y-2 text-gray-700">
          <div>
            <span className="font-semibold">Languages:</span>{' '}
            {clergy.languages.join(', ')}
          </div>
          
          <div>
            <span className="font-semibold">Church:</span>{' '}
            {clergy.church}
          </div>
          
          <div>
            <span className="font-semibold">Address:</span>{' '}
            {clergy.address}
          </div>
        </div>

        {showMore && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-700">{clergy.bio}</p>
            {clergy.contact && (
              <div className="mt-3">
                <span className="font-semibold">Contact:</span>{' '}
                {clergy.contact}
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-4 text-medium-green hover:text-forest-green font-semibold transition-colors"
        >
          {showMore ? 'Show Less' : 'Read More'} →
        </button>
      </div>
    </div>
  );
}

export default ClergyCard;
