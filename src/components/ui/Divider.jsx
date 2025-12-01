import React from 'react';

const Divider = ({ text }) => {
  if (text) {
    return (
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-neutralDark"></div>
        <span className="text-neutralDark text-sm">{text}</span>
        <div className="flex-1 h-px bg-neutralDark"></div>
      </div>
    );
  }

  return <div className="w-full h-px bg-neutral my-4"></div>;
};

export default Divider;
