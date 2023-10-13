import React, {useLayoutEffect, useState, useRef} from 'react';
import './venus.css';



// Menu will need a new prop for asteroid information
function Venus({ venusMenuVisible }) {

    console.log( 'Inside Venus Screen' );
    const [ canvasDimensions, setCanvasDimensions ] = useState({ width: 0, height: 0 });
    const canvasRef = useRef( null );

    useLayoutEffect( () => {
        
        const canvas = canvasRef.current;
    
        const context2 = canvas.getContext( '2d' );
    
        const resizeCanvas = () => {
          
          canvas.width = window.innerWidth * 0.78;
          canvas.height = window.innerHeight * 0.79;

          // determine the radius of the planets
          const venusRadius = Math.min( canvas.width, canvas.height ) * 0.3;
          const earthRadius = Math.min( canvas.width, canvas.height ) * 0.2;
          const mercuryRadius = Math.min( canvas.width, canvas.height ) * 0.2;
    
          context2.fillStyle = 'black';
          context2.fillRect( 0, 0, canvas.width, canvas.height );
    
          setCanvasDimensions( {width: canvas.width, height: canvas.height} );

          // call the draw functions from inside the resizeCanvas function
          drawVenus( venusRadius );
          drawEarth( earthRadius );
          drawMercury( mercuryRadius );

        }

        const drawVenus = ( radius ) => {
          const x = canvas.width / 2;
          const y = canvas.height / 2;
          context2.beginPath();
          context2.moveTo( x, y );
          context2.arc( x, y, radius, 0, Math.PI * 2 );
          context2.fillStyle = '#C57F00';
          context2.fill();
          context2.closePath();
        } // end drawVenus functin

        const drawEarth = ( radius ) => {
          context2.beginPath();
          context2.moveTo(canvas.width + 100, canvas.height / 2);
          context2.arc( canvas.width + 100, canvas.height / 2, radius, Math.PI / 2, 3 * Math.PI / 2 );
          context2.fillStyle = '#0076FF';
          context2.fill();
          context2.closePath();
        }

        const drawMercury = ( radius ) => {
          context2.beginPath();
          context2.moveTo( -100, canvas.height / 2 );
          context2.arc( -100, canvas.height / 2, radius, 3 * Math.PI / 2, Math.PI / 2 );
          context2.fillStyle = '#B1B1AC';
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
        <div className = 'frontend__containers__venus' style = {canvasDimensions}>
            <canvas ref={canvasRef} className="venus-canvas" />
        </div>
      );
    }

export default Venus;