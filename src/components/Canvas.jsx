import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

function Canvas() {
  const canvasRef = useRef(null);
  const { state } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize canvas
    const initCanvas = () => {
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    initCanvas();
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="design-canvas" />
    </div>
  );
}

export default Canvas;