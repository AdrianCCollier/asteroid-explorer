import React, {useRef, useLayoutEffect, useState, useEffect } from 'react';
import drawSun from '../system/sun';
import drawEarth from '../system/earth';
import drawMercury from '../system/mercury';
import drawVenus from '../system/venus';
import Asteroids from '../system/Asteroids.jsx';
import Menu from '../menu/Menu.jsx';
import './canvas.css';

// Adrian, 9/22. added asteroids as a prop here, being passed down from Solar.js, its coming all the way from localhost:3000/asteroids, it was sent to Solar.js, and now here. The goal is to display actual asteroid data when an asteroid is clicked, so its going to asteroids.js next
// Malyk, 9/25. "click" event listening for asteroids has been moved into here. asteroid information should be passed to Menu inside return
function CanvasContainer({asteroids}) {

  const canvasRef = useRef( null );
  const [ canvasDimensions, setCanvasDimensions ] = useState({ width: 0, height: 0 });
  const [ isMenuOpen, setMenuOpen ] = useState( false );
  const [ asteroidInformation, setAsteroidInformation ] = useState( {name: 'asteroid', diameter: 10, distanceFromEarth: 100 } );

  const closeMenu = () => {
    setMenuOpen( false );
  };

  useEffect( () => {
    const canvas = canvasRef.current;

    canvas.addEventListener( "mousemove", function(e) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        
        var plan1X = canvas.width * 0.33; // for Mercury
        var plan1Y = canvas.height / 2; // for Mercury
        var plan2X = canvas.width * 0.66; // for Venus
        var plan2Y = canvas.height / 2; // for Venus
        var plan3X = canvas.width * 0.95; // for Earth
        var plan3Y = canvas.height / 2; // for Earth
        var ast4X = canvas.width * 0.75;
        var ast4Y = canvas.height / 1.25;
        var ast5X = canvas.width * 0.25;
        var ast5Y = canvas.height * 0.1;
        var ast6X = canvas.width / 1.08;
        var ast6Y = canvas.height / 5;
        var rad1 = 28.195; // radius of Mercury
        var rad2 = 70.75; // radius of Venus
        var rad3 = 75; // radius of Earth
        var rad4 = 15; // radius of first asteroid
        var rad5 = 12; // radius of second asteroid
        var rad6 = 25; // radius of third asteroid

        // calculate the distance from the mouse to each asteroids center
        var distance1 = Math.sqrt(( mouseX - plan1X ) ** 2 + ( mouseY - plan1Y ) ** 2);
        var distance2 = Math.sqrt(( mouseX - plan2X ) ** 2 + ( mouseY - plan2Y ) ** 2);
        var distance3 = Math.sqrt(( mouseX - plan3X ) ** 2 + ( mouseY - plan3Y ) ** 2);
        var distance4 = Math.sqrt(( mouseX - ast4X ) ** 2 + ( mouseY - ast4Y ) ** 2);
        var distance5 = Math.sqrt(( mouseX - ast5X ) ** 2 + ( mouseY - ast5Y ) ** 2);
        var distance6 = Math.sqrt(( mouseX - ast6X ) ** 2 + ( mouseY - ast6Y ) ** 2);

        // check if mouse is inside any of the circles
        if( distance1 < rad1 || distance2 < rad2 || distance3 < rad3 || distance4 < rad4 || distance5 < rad5 || distance6 < rad6 ) {
            canvas.style.cursor = "pointer";
        }
        else {
            canvas.style.cursor = "default";
        }
    });

}, [canvasRef]);



  useLayoutEffect( () => {
    const canvas = canvasRef.current;

    const context = canvas.getContext( '2d' );

    const resizeCanvas = () => {
      
      canvas.width = window.innerWidth * 0.77;
      canvas.height = window.innerHeight * 0.785;

      context.fillStyle = 'black';
      context.fillRect( 0, 0, canvas.width, canvas.height );

      setCanvasDimensions( {width: canvas.width, height: canvas.height} );
      
      drawSun( context, canvas.height );
      drawEarth( context, canvas.height, canvas.width );
      drawMercury( context, canvas.height, canvas.width );
      drawVenus( context, canvas.height, canvas.width );
    }

    resizeCanvas();
    
    // eventListener to handle the clicking of an asteroid
    canvas.addEventListener( "click", function(e) {
      
      // Malyk 10/5/23
      // you will get errors if you do not first check to ensure that asteroids is not empty even though asteroids should not be empty when we are at this point
      // no I do not know why
      if( !asteroids || asteroids.length < 3 ) {
        return;
      } // end if

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
      // from here we will set setMenuOpen to true and pass asteroid information to Menu
      if( distance1 < rad1 ) {
        setMenuOpen( true );
        console.log( 'Asteroid 1 clicked');
        setAsteroidInformation( { name: asteroids[0].name, diameter: asteroids[0].estimated_diameter.kilometers.estimated_diameter_max, distanceFromEarth: asteroids[0].orbital_data.perihelion_distance } );
      } // end if
      else if( distance2 < rad2 ) {
        setMenuOpen( true );
        console.log( 'Asteroid 2 clicked');
        setAsteroidInformation( { name: asteroids[1].name, diameter: asteroids[1].estimated_diameter.kilometers.estimated_diameter_max, distanceFromEarth: asteroids[1].orbital_data.perihelion_distance } );
      } // end else if
      else if( distance3 < rad3 ) {
        setMenuOpen( true );
        console.log( 'Asteroid 3 clicked');
        setAsteroidInformation( { name: asteroids[2].name, diameter: asteroids[2].estimated_diameter.kilometers.estimated_diameter_max, distanceFromEarth: asteroids[2].orbital_data.perihelion_distance } );
      } // end else if
  });
  
  // working event listener to resize the canvas
  // Asteroids will not be displayed after the canvas is resized
  window.addEventListener( 'resize', resizeCanvas );
    return () => {
      window.removeEventListener( 'resize', resizeCanvas );
    };

  }, [asteroids]);

  return (
    <div className='frontend__containers__canvas'>   
      <canvas id = "frontend__containers__canvas__init" ref = {canvasRef}></canvas>
      {asteroids && <Asteroids canvasRef={canvasRef} /> }
      { isMenuOpen && < Menu canvasDimensions={canvasDimensions} asteroidInformation={asteroidInformation} closeMenu={closeMenu} /> }
    </div>
  );
}

export default CanvasContainer;