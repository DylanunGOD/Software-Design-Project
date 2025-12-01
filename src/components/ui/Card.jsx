import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`card p-4 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
