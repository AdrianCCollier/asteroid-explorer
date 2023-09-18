import React, {useRef, useEffect } from 'react';
import drawSun from '../system/sun';
import drawEarth from '../system/earth';
import drawAsteroids from '../system/asteroids';

function CanvasContainer() {

  const canvasRef = useRef( null );

  useEffect( () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext( '2d' );

    const resizeCanvas = () => {
      
      const solarContent = document.querySelector( '.solar__content');
      canvas.width = solarContent.clientWidth * 0.99;
      canvas.height = solarContent.clientHeight * 0.98;

      context.fillStyle = 'black';
      context.fillRect( 0, 0, canvas.width, canvas.height );
      
      drawSun( context, canvas.height );
      drawEarth( context, canvas.height, canvas.width );
      drawAsteroids( context, canvas.height, canvas.width );
    };

    resizeCanvas();

    window.addEventListener( 'resize', resizeCanvas );

    return () => {
      window.removeEventListener( 'resize', resizeCanvas );
    };

  }, []);

  return (
    <canvas id = "frontend__containers__canvas" ref = {canvasRef}></canvas>
  );
}

export default CanvasContainer;