import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

function DataViewer() {
  const { state } = useApp();

  if (state.loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="data-viewer">
      {/* Add your data display logic here */}
    </div>
  );
}

export default DataViewer;