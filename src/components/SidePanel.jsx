import React from 'react';

function SidePanel({ title, children }) {
  return (
    <div className="side-panel">
      <div className="panel-header">
        <h3>{title}</h3>
      </div>
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}

export default SidePanel;