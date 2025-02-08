import React from 'react';

function ToolOption({ icon, label, active, onClick }) {
  return (
    <button 
      className={`tool-option ${active ? 'active' : ''}`}
      onClick={onClick}
      title={label}
    >
      <span className={`tool-icon ${icon}`}></span>
      <span className="tool-label">{label}</span>
    </button>
  );
}

export default ToolOption;