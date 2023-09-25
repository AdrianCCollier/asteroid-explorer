import React, {useRef, useLayoutEffect, useState } from 'react';
import drawSun from '../system/sun';
import drawEarth from '../system/earth';
import Asteroids from '../system/Asteroids.jsx';
import Menu from '../menu/Menu.jsx';
import './canvas.css';

function CanvasContainer() {

  const canvasRef = useRef( null );
  const [ canvasDimensions, setCanvasDimensions ] = useState({ width: 0, height: 0 });
  const [ isMenuOpen, setMenuOpen ] = useState( false );

  useLayoutEffect( () => {
    const canvas = canvasRef.current;

    if( canvas ) {
    const context = canvas.getContext( '2d' );

    const resizeCanvas = () => {
      
      const solarContent = document.querySelector( '.solar__content');
      canvas.width = solarContent.clientWidth * 0.99;
      canvas.height = solarContent.clientHeight * 0.98;

      context.fillStyle = 'black';
      context.fillRect( 0, 0, canvas.width, canvas.height );

      setCanvasDimensions( {width: canvas.width, height: canvas.height} );
      
      drawSun( context, canvas.height );
      drawEarth( context, canvas.height, canvas.width );

    };

    resizeCanvas();

    // working event listener to resize the canvas
    // Asteroids will not be displayed after the canvas is resized( hence why this is commented out )
    //window.addEventListener( 'resize', resizeCanvas );

    //return () => {
      //window.removeEventListener( 'resize', resizeCanvas );
    //};
  }
  

  canvas.addEventListener( "click", function(e) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;

    var ast1X = canvas.width * 0.75;
    var ast1Y = canvas.height / 1.25;
    var ast2X = canvas.width * 0.25;
    var ast2Y = canvas.height * 0.1;
    var ast3X = canvas.width / 1.08;
    var ast3Y = canvas.height / 5;
    var rad1 = 15;
    var rad2 = 12;
    var rad3 = 25;

    // calculate the distance from the mouse to each asteroids center
    var distance1 = Math.sqrt(( mouseX - ast1X ) ** 2 + ( mouseY - ast1Y ) ** 2);
    var distance2 = Math.sqrt(( mouseX - ast2X ) ** 2 + ( mouseY - ast2Y ) ** 2);
    var distance3 = Math.sqrt(( mouseX - ast3X ) ** 2 + ( mouseY - ast3Y ) ** 2);

    // check if mouse is inside any of the circles
    if( distance1 < rad1 ) {
        setMenuOpen( true );
    }
    else if( distance2 < rad2 ) {
        setMenuOpen( true );
    }
    else if( distance3 < rad3 ) {
        setMenuOpen( true );
    }
  });

  }, []);

  return (
    <div className='frontend__containers__canvas'>   
      <canvas id = "frontend__containers__canvas__init" ref = {canvasRef}></canvas>
      <Asteroids canvasRef={canvasRef} />
      { isMenuOpen && < Menu canvasDimensions={canvasDimensions} /> }
    </div>
  );
}

export default CanvasContainer;