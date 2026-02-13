import React from 'react';

const Card = ({ children, className = '', hover = true }) => {
    return (
        <div
            className={`
        bg-white/80 backdrop-blur-md border border-white/60 
        rounded-2xl p-6 shadow-sm
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
