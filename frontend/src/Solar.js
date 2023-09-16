import React, {useRef, useEffect } from 'react';
import './Solar.css';
import './index.css';
import { Header } from './containers';

function Solar() {

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
      
      context.beginPath();
      context.moveTo( 0, solarContent.clientHeight );
      context.arc( 0, solarContent.clientHeight, 600, 1.5 * Math.PI, 0 );
      context.fillStyle = 'yellow';
      context.fill();
      context.closePath();
    };

    resizeCanvas();

    window.addEventListener( 'resize', resizeCanvas );

    return () => {
      window.removeEventListener( 'resize', resizeCanvas );
    };

  }, []);

  return (
    <div className="solar">
      <Header />
      <div className= "solar__content" >
        <canvas className = "solar__content-dynamic-canvas" ref = {canvasRef}></canvas>
      </div>
    </div>
  );
}

export default Solar;
