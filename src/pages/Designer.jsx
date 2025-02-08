import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import DesignerToolbar from '@/components/DesignerToolbar';
import Canvas from '@/components/Canvas';
import SidePanel from '@/components/SidePanel.jsx';

function Designer() {
  const [designState, setDesignState] = useState({
    clipart: [],
    overlays: [],
    templates: []
  });

  const { state, setState } = useApp();

  useEffect(() => {
    // Load necessary data
    Promise.all([
      fetch('clipart-roles.json'),
      fetch('overlays-roles.json'),
      fetch('templates-roles.json')
    ])
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(([clipart, overlays, templates]) => {
        setDesignState({
          clipart,
          overlays,
          templates
        });
      });
  }, []);

  if (state.loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="designer-container">
      <div className="designer-toolbar">
        <DesignerToolbar onToolSelect={(tool) => setState(prev => ({ ...prev, currentTool: tool }))} />
      </div>
      <div className="designer-workspace">
        <Canvas />
      </div>
      <div className="designer-panels">
        <SidePanel title="Clipart">
          {designState.clipart.map((item, index) => (
            <div key={index} className="clipart-item">
              {/* Add clipart items */}
            </div>
          ))}
        </SidePanel>
        <SidePanel title="Overlays">
          {designState.overlays.map((item, index) => (
            <div key={index} className="overlay-item">
              {/* Add overlay items */}
            </div>
          ))}
        </SidePanel>
        <SidePanel title="Templates">
          {designState.templates.map((item, index) => (
            <div key={index} className="template-item">
              {/* Add template items */}
            </div>
          ))}
        </SidePanel>
      </div>
    </div>
  );
}

export default Designer;