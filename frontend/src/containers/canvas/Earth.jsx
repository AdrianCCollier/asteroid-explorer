import React, {useLayoutEffect, useState, useRef} from 'react';
import './earth.css';

// This function defines the dimensions and attributes of Earth in our solar system
function Earth({ earthMenuVisible }) {

    console.log( 'Inside Earth Screen' );
    const [ canvasDimensions, setCanvasDimensions ] = useState({ width: 0, height: 0 });
    const canvasRef = useRef( null );

    useLayoutEffect( () => {
        
        const canvas = canvasRef.current;
    
        const context2 = canvas.getContext( '2d' );
    
        const resizeCanvas = () => {

          canvas.width = window.innerWidth * 0.78;
          canvas.height = window.innerHeight * 0.79;

          // calculate the radius based on the size of the canvas
          const earthRadius = Math.min( canvas.width, canvas.height ) * 0.3;
        // const venusRadius = Math.min( canvas.width, canvas.height ) * 0.26;
    
          context2.fillStyle = 'black';
          context2.fillRect( 0, 0, canvas.width, canvas.height );
    
          setCanvasDimensions( {width: canvas.width, height: canvas.height} );
          
          // need to call functions to draw the Earthinside of resizeCanvas function so that
          // whenever the canvas is resized the Earth doesn't dissappear
          drawEarth( earthRadius, canvas.width, canvas.height, context2);
        //   drawVenus( venusRadius );
          
        } // end resizeCanvas function

        // function to draw the earth
        const drawEarth = ( radius, canvasWidth, canvasHeight, context ) => {
            // Create an image element for the Earth sprite
            const earthImage = new Image();
            earthImage.src = './assets/Earth.png';

            // Wait for the image to load before drawing it
            earthImage.onload = function() {
                // Draw the Earth sprite on the canvas
                context.drawImage(earthImage, (canvasWidth / 2) - (256 / 2), (canvasHeight / 2) - (256 / 2), 256, 256); // Adjust the size and position as needed
            };
        } // end drawEarth function


        resizeCanvas();

        // listener to handle resizing of screen
        window.addEventListener( 'resize', resizeCanvas );
            return () => {
            window.removeEventListener( 'resize', resizeCanvas );
        };

    }, []);

    return (
        <div className = 'frontend__containers__earth' style = {canvasDimensions}>
            <canvas ref={canvasRef} className="earth-canvas" />
        </div>
      );
} // end Earth function

export default Earth;