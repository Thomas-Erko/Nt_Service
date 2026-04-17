import React from 'react';

function NewFooter() {
  return (
    <footer className="bg-green-900 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-2 text-center">
        <p className="font-ethiopic text-gold-accent opacity-70 text-sm mb-2">
          የማታ አገልግሎት · Nighttime Service
        </p>
        <p className="text-white opacity-55 text-xs max-w-3xl mx-auto leading-relaxed">
          An independent community knowledge resource for EOTC members across the United States. 
          Not endorsed by or affiliated with the Ethiopian Orthodox Tewahedo Church or 
          any of its governing bodies.
        </p>
      </div>
    </footer>
  );
}

export default NewFooter;
