import React, {useLayoutEffect, useState, useRef} from 'react';
import './mercury.css';

// Menu will need a new prop for asteroid information
function Mercury({ mercuryMenuVisible }) {

    console.log( 'Inside Mercury Screen' );
    const [ canvasDimensions, setCanvasDimensions ] = useState({ width: 0, height: 0 });
    const canvasRef = useRef( null );

    useLayoutEffect( () => {
        
        const canvas = canvasRef.current;
    
        const context2 = canvas.getContext( '2d' );
    
        const resizeCanvas = () => {
          
          canvas.width = window.innerWidth * 0.78;
          canvas.height = window.innerHeight * 0.79;

          const mercuryRadius = Math.min( canvas.width, canvas.height ) * 0.1;
          const venusRadius = Math.min( canvas.width, canvas.height ) * 0.3;
          const sunRadius = Math.min( canvas.width, canvas.height ) * 0.7;
    
          context2.fillStyle = 'black';
          context2.fillRect( 0, 0, canvas.width, canvas.height );
    
          setCanvasDimensions( {width: canvas.width, height: canvas.height} );
          
          drawMercury( mercuryRadius );
          drawVenus( venusRadius );
          drawSun( sunRadius );

        }

        const drawMercury = ( radius ) => {
          const x = canvas.width / 2;
          const y = canvas.height / 2;
          context2.beginPath();
          context2.moveTo( x, y );
          context2.arc( x, y, radius, 0, Math.PI * 2 );
          context2.fillStyle = '#B1B1AC';
          context2.fill();
          context2.closePath();
        } // end drawMercury function

        const drawVenus = ( radius ) => {
          context2.beginPath();
          context2.moveTo( canvas.width + 100, canvas.height / 2 );
          context2.arc( canvas.width + 100, canvas.height / 2, radius, Math.PI / 2, 3 * Math.PI / 2 );
          context2.fillStyle = '#C57F00';
          context2.fill();
          context2.closePath();
        } // end drawVenus function

        const drawSun = ( radius ) => {
          context2.beginPath();
          context2.moveTo( -300, canvas.height / 2 );
          context2.arc( -300, canvas.height / 2, radius, 3 * Math.PI / 2, Math.PI / 2 );
          context2.fillStyle = 'yellow';
          context2.fill();
          context2.closePath();
        }

        resizeCanvas();

        // listener to handle resizing of screen
        window.addEventListener( 'resize', resizeCanvas );
            return () => {
            window.removeEventListener( 'resize', resizeCanvas );
        };

    }, []);

    return (
        <div className = 'frontend__containers__mercury' style = {canvasDimensions}>
            <canvas ref={canvasRef} className="mercury-canvas" />
        </div>
      );
    }

export default Mercury;