import React from 'react';

function Amharic({ children, className = '' }) {
  return (
    <span className={`font-ethiopic ${className}`}>
      {children}
    </span>
  );
}

export default Amharic;
