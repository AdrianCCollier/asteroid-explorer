import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import drawEarth from '../system/earth'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'antd'
import drawAsteroids from '../system/asteroids.js'
import './canvas.css'

// Adrian, 9/22. added asteroids as a prop here, being passed down from Solar.js, its coming all the way from localhost:3000/asteroids, it was sent to Solar.js, and now here. The goal is to display actual asteroid data when an asteroid is clicked, so its going to asteroids.js next
// Malyk, 9/25. "click" event listening for asteroids has been moved into here. asteroid information should be passed to Menu inside return
function CanvasContainer({ asteroids }) {
  const canvasRef = useRef(null)
  const shipCanvasRef = useRef(null)
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  })

  const [asteroidInformation, setAsteroidInformation] = useState({
    name: 'asteroid',
    diameter: 10,
    distanceFromEarth: 100,
  })

  const [tooltipVisible, setTooltipVisible] = useState([
    false,
    false,
    false,
    false,
  ])

  const location = useLocation()

  // function to bring to ship to Ceres
  const handleCeresClick = () => {
    console.log( 'Ceres Explore button clicked!' )
    localStorage.clear()
    console.log( localStorage )
  }

  // state to keep track of which asteroid was clicked, to load different phaser levels
  const [clickedAsteroidIndex, setClickedAsteroidIndex] = useState(null)

  const handleAsteroidClick = (index) => {
    setTooltipVisible((prevTooltipVisible) => {
      const updatedTooltipVisible = [...prevTooltipVisible]

      // loop to close all other tooltips before opening current tooltip
      for (let i = 0; i < updatedTooltipVisible.length; i++) {
        updatedTooltipVisible[i] = false
      } // end for

      updatedTooltipVisible[index] = !updatedTooltipVisible[index]
      console.log('Inside handleAsteroidCLick const ' + index)
      return updatedTooltipVisible
    })
  }

  const shipImage = new Image()
  shipImage.src = './assets/Ship.png'
  const flyingShipImage = new Image()
  flyingShipImage.src = './assets/Ship_Flying1.png'

  const [shipPosition, setShipPosition] = useState({
    shipX: localStorage.getItem( 'shipX' ) || 320,
    shipY: localStorage.getItem( 'shipY' ) || ( window.innerHeight * 0.785 ) * 0.55
  })
  

  const earthToRyugu = (shipCanvas) => {
    console.log( "inside earth to ryugu function" )
    console.log( localStorage )
    const shipContext = shipCanvas.getContext( '2d' )
    let shipHeight = 32
    let shipWidth = 32
    let shipX = shipPosition.shipX
    let shipY = shipPosition.shipY
    let rotationAngle = Math.PI / 2 // rotates by 90 degrees radian

    const animate = () => {

      // draw the background without clearing the entire canvas
      shipContext.clearRect( 0, 0, shipCanvas.width, shipCanvas.height )

      // save the current context before applying transformation
      shipContext.save();

      // translate the context to the centger of the ship
      shipContext.translate( shipX, shipY )

      // rotate the context
      shipContext.rotate( rotationAngle )

      // draw the rotated ship
      shipContext.drawImage( flyingShipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )

      // restore the context to its original state
      shipContext.restore()

      shipX += 2

      // check to see if ship has reached the right edge of the canvas
      if( shipX > shipCanvas.width * 0.33 ) {
        shipContext.drawImage( shipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )
        if( location.pathname !== '/level0' )
          window.location.href = '/level0'
        setShipPosition({ shipX, shipY })
        console.log( "shipX and shipY: ", shipX, shipY )
        console.log( "Updated shipX and shipY: ", shipPosition.shipX, " ", shipPosition.shipY )
        localStorage.setItem( 'shipX', shipX )
        localStorage.setItem( 'shipY', shipY )
        console.log( localStorage )
        return
      } // end if

      // request the next animation frame
      requestAnimationFrame( animate )
    }; // end animate function

    // start the animation
    animate()

  } // end earth to Ryugu function

  const ryuguToVesta = (shipCanvas) => {
    console.log( "inside Ryugu to Vesta function" )
    console.log( localStorage )
    const shipContext = shipCanvas.getContext( '2d' )
    let shipHeight = 32
    let shipWidth = 32
    let shipX = shipPosition.shipX
    let shipY = shipPosition.shipY
    let rotationAngle = Math.PI / 4 // rotates by 45 degrees radian

    const animate = () => {

      // draw the background without clearing the entire canvas
      shipContext.clearRect( 0, 0, shipCanvas.width, shipCanvas.height )

      // save the current context before applying transformation
      shipContext.save();

      // translate the context to the centger of the ship
      shipContext.translate( shipX, shipY )

      // rotate the context
      shipContext.rotate( rotationAngle )

      // draw the rotated ship
      shipContext.drawImage( flyingShipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )

      // restore the context to its original state
      shipContext.restore()

      shipX += 2
      shipY -= 2

      // check to see if ship has reached the right edge of the canvas
      if( shipX > shipCanvas.width * 0.5 ) {
        shipContext.drawImage( shipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )
        if( location.pathname !== '/level1' )
          window.location.href = '/level1'
        setShipPosition({ shipX, shipY })
        console.log( "shipX and shipY: ", shipX, shipY )
        console.log( "Updated shipX and shipY: ", shipPosition.shipX, " ", shipPosition.shipY )
        localStorage.setItem( 'shipX', shipX )
        localStorage.setItem( 'shipY', shipY )
        console.log( localStorage )
        return
      } // end if

      // request the next animation frame
      requestAnimationFrame( animate )
    }; // end animate function

    // start the animation
    animate()

  } // end Ryugu to Vesta function

  const vestaToPsyche = (shipCanvas) => {
    console.log( "inside Vesta to Psyche function" )
    console.log( localStorage )
    const shipContext = shipCanvas.getContext( '2d' )
    let shipHeight = 32
    let shipWidth = 32
    let shipX = shipPosition.shipX
    let shipY = shipPosition.shipY

    const animate = () => {

      // draw the background without clearing the entire canvas
      shipContext.clearRect( 0, 0, shipCanvas.width, shipCanvas.height )

      // save the current context before applying transformation
      shipContext.save();

      // translate the context to the centger of the ship
      shipContext.translate( shipX, shipY )

      // rotate the context
      shipContext.rotate( (120 * Math.PI ) / 180 )

      // draw the rotated ship
      shipContext.drawImage( flyingShipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )

      // restore the context to its original state
      shipContext.restore()

      shipX += 2
      shipY += 1.25

      // check to see if ship has reached the right edge of the canvas
      if( shipX > shipCanvas.width * 0.67 ) {
        shipContext.drawImage( shipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )
        if( location.pathname !== '/level2' )
          window.location.href = '/level2'
        setShipPosition({ shipX, shipY })
        console.log( "shipX and shipY: ", shipX, shipY )
        console.log( "Updated shipX and shipY: ", shipPosition.shipX, " ", shipPosition.shipY )
        localStorage.setItem( 'shipX', shipX )
        localStorage.setItem( 'shipY', shipY )
        console.log( localStorage )
        return
      } // end if

      // request the next animation frame
      requestAnimationFrame( animate )
    }; // end animate function

    // start the animation
    animate()

  } // end Vesta to Psyche 16 function

  const pycheToCeres = (shipCanvas) => {
    console.log( "inside Psyche to Ceres function" )
    console.log( localStorage )
    const shipContext = shipCanvas.getContext( '2d' )
    let shipHeight = 32
    let shipWidth = 32
    let shipX = shipPosition.shipX
    let shipY = shipPosition.shipY

    const animate = () => {

      // draw the background without clearing the entire canvas
      shipContext.clearRect( 0, 0, shipCanvas.width, shipCanvas.height )

      // save the current context before applying transformation
      shipContext.save();

      // translate the context to the centger of the ship
      shipContext.translate( shipX, shipY )

      // rotate the context
      shipContext.rotate( (90 * Math.PI ) / 180 )

      // draw the rotated ship
      shipContext.drawImage( flyingShipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )

      // restore the context to its original state
      shipContext.restore()

      shipX += 2

      // check to see if ship has reached the right edge of the canvas
      if( shipX > shipCanvas.width * 0.9 ) {
        shipContext.drawImage( shipImage, -shipWidth, -shipHeight, shipWidth, shipHeight )
        if( location.pathname !== '/level3' )
          window.location.href = '/level3'
        setShipPosition({ shipX, shipY })
        console.log( "shipX and shipY: ", shipX, shipY )
        console.log( "Updated shipX and shipY: ", shipPosition.shipX, " ", shipPosition.shipY )
        localStorage.setItem( 'shipX', shipX )
        localStorage.setItem( 'shipY', shipY )
        console.log( localStorage )
        return
      } // end if

      // request the next animation frame
      requestAnimationFrame( animate )
    }; // end animate function

    // start the animation
    animate()

  } // end Psyche to Ceres function

  useEffect( () => {
    console.log( "Inside use effect to store shipX and shipY" )
    const storedShipX = localStorage.getItem( 'shipX' )
    const storedShipY = localStorage.getItem( 'shipY' )

    setShipPosition({
      shipX: storedShipX ? parseFloat( storedShipX ) : 320,
      shipY: storedShipY ? parseFloat( storedShipY ) : ( window.innerHeight * 0.785 ) * 0.55
    });
  }, [])

  useEffect(() => {
    const shipCanvas = canvasRef.current

    shipCanvas.addEventListener('mousemove', function (e) {
      var rect = shipCanvas.getBoundingClientRect()
      var mouseX = e.clientX - rect.left
      var mouseY = e.clientY - rect.top

      //var plan3X = canvas.width * 0.25 // for Earth
      //var plan3Y = canvas.height * 0.5 // for Earth

      // Ryugu
      var ast4X = shipCanvas.width * 0.35 // for asteroid 1
      var ast4Y = shipCanvas.height * 0.6 // for asteroid 1

      // Vesta
      var ast5X = shipCanvas.width * 0.511 // for asteroid 2
      var ast5Y = shipCanvas.height * 0.18 // for asteroid 2

      // Psyche
      var ast6X = shipCanvas.width * 0.7 // for asteroid 3
      var ast6Y = shipCanvas.height * 0.4 // for astesroid 3

      // Ceres
      var ast7X = shipCanvas.width * 0.9 // for asteroid 4
      var ast7Y = shipCanvas.height * 0.45 // for asteroid 4

      //var rad3 = 75 // radius of Earth
      var rad4 = 15 // Ryugu
      var rad5 = 35 // Vesta
      var rad6 = 25 // Psyche
      var rad7 = 45 // Ceres Radius

      // calculate the distance from the mouse to each asteroids center
      var distance4 = Math.sqrt((mouseX - ast4X) ** 2 + (mouseY - ast4Y) ** 2)
      var distance5 = Math.sqrt((mouseX - ast5X) ** 2 + (mouseY - ast5Y) ** 2)
      var distance6 = Math.sqrt((mouseX - ast6X) ** 2 + (mouseY - ast6Y) ** 2)
      var distance7 = Math.sqrt((mouseX - ast7X) ** 2 + (mouseY - ast7Y) ** 2)

      // check if mouse is inside any of the circles
      if (
        distance4 < rad4 ||
        distance5 < rad5 ||
        distance6 < rad6 ||
        distance7 < rad7
      ) {
        shipCanvas.style.cursor = 'pointer'
      } else {
        shipCanvas.style.cursor = 'default'
      }
    })
  }, [canvasRef])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const shipCanvas = shipCanvasRef.current

    const context = canvas.getContext('2d')
    const shipContext = shipCanvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.77
      canvas.height = window.innerHeight * 0.785

      shipCanvas.width = window.innerWidth * 0.77
      shipCanvas.height = window.innerHeight * 0.785

      setCanvasDimensions({ width: canvas.width, height: canvas.height })

      const backgroundImage = new Image()
      backgroundImage.src = './assets/Background.jpg'

      backgroundImage.onload = function() {
        context.drawImage( backgroundImage, 0, 0, canvas.width, canvas.height )
      }

      drawEarth(context, canvas.height, canvas.width)
      drawAsteroids(context, canvas.height, canvas.width)

      let shipHeight = 32
      let shipWidth = 32
      let shipX = shipPosition.shipX
      let shipY = shipCanvas.height * 0.55
      let rotationAngle = Math.PI / 2// rotates by 45 degrees radian
      shipImage.onload = function () {

        console.log( "inside shipImage on load" )
        console.log( "Initial shipX and shipY: ", shipX, " ", shipY )
        console.log( "Inside function: ", shipPosition )
          
        // draw the background without clearing the entire canvas
        shipContext.clearRect( 0, 0, shipCanvas.width, shipCanvas.height )

        // save the current context before applying transformation
        shipContext.save();

        // translate the context to the centger of the ship
        shipContext.translate( shipX, shipY )

        // rotate the context
        shipContext.rotate( rotationAngle )

        // restore the context to its original state
        shipContext.restore()

        // draw the rotated ship
        shipContext.drawImage( shipImage, shipPosition.shipX, shipPosition.shipY, shipWidth, shipHeight)

      } // Ship PNG has been initially drawn on the canvas

    } // end resize canvas function

    resizeCanvas()

    // eventListener to handle the clicking of an asteroid
    shipCanvas.addEventListener('click', function (e) {
      // Malyk 10/5/23
      // you will get errors if you do not first check to ensure that asteroids is not empty even though asteroids should not be empty when we are at this point
      // no I do not know why
      if (!asteroids || asteroids.length < 3) {
        return
      } // end if

      var rect = shipCanvas.getBoundingClientRect()
      var mouseX = e.clientX - rect.left
      var mouseY = e.clientY - rect.top

      var ryuguX = shipCanvas.width * 0.35
      var ryuguY = shipCanvas.height * 0.6

      var vestaX = shipCanvas.width * 0.511
      var vestaY = shipCanvas.height * 0.18

      var ast3X = shipCanvas.width * 0.7
      var ast3Y = shipCanvas.height * 0.4

      var ast4X = shipCanvas.width * 0.9
      var ast4Y = shipCanvas.height * 0.45

      var rad1 = 15
      var rad2 = 35
      var rad3 = 25
      var rad4 = 45

      // calculate the distance from the mouse to each asteroids center
      var distance1 = Math.sqrt((mouseX - ryuguX) ** 2 + (mouseY - ryuguY) ** 2)
      var distance2 = Math.sqrt((mouseX - vestaX) ** 2 + (mouseY - vestaY) ** 2)
      var distance3 = Math.sqrt((mouseX - ast3X) ** 2 + (mouseY - ast3Y) ** 2)
      var distance4 = Math.sqrt((mouseX - ast4X) ** 2 + (mouseY - ast4Y) ** 2)

      // check if mouse is inside any of the circles
      // from here we will set setMenuOpen to true and pass asteroid information to Menu
      if (distance1 < rad1) {
        console.log('Asteroid 0 clicked')
        setCanvasDimensions({
          width: ryuguX - 50,
          height: ryuguY - 50,
        })
        setAsteroidInformation({
          name: asteroids[0].name,
          diameter: asteroids[0].diameter,
          distanceFromEarth: asteroids[0].distanceFromEarth,
        })
        handleAsteroidClick(0)
        setClickedAsteroidIndex(0)
      } // end if
      else if (distance2 < rad2) {
        console.log('Asteroid 1 clicked')
        setCanvasDimensions({
          width: vestaX + 425,
          height: vestaY - 50,
        })
        setAsteroidInformation({
          name: asteroids[1].name,
          diameter: asteroids[1].diameter,
          distanceFromEarth: asteroids[1].distanceFromEarth,
        })
        handleAsteroidClick(1)
        setClickedAsteroidIndex(1)
      } // end else if
      else if (distance3 < rad3) {
        console.log('Asteroid 2 clicked')
        setCanvasDimensions({
          width: ast3X - 50,
          height: ast3Y - 50,
        })
        setAsteroidInformation({
          name: asteroids[2].name,
          diameter: asteroids[2].diameter,
          distanceFromEarth: asteroids[2].distanceFromEarth,
        })
        handleAsteroidClick(2)
        setClickedAsteroidIndex(2)
      } // end else if
      else if (distance4 < rad4) {
        console.log('Asteroid 3 clicked')
        setCanvasDimensions({
          width: ast4X - 50,
          height: ast4Y - 50,
        })
        setAsteroidInformation({
          name: asteroids[3].name,
          diameter: asteroids[3].diameter,
          distanceFromEarth: asteroids[3].distanceFromEarth,
        })
        handleAsteroidClick(3)
        setClickedAsteroidIndex(3)
      } // end else if
    })

    // working event listener to resize the canvas
    // Asteroids will not be displayed after the canvas is resized
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [asteroids])

  return (
    <div className="frontend__containers__canvas">
      <canvas id="frontend__containers__canvas__init" ref={canvasRef}></canvas>
      <canvas id="frontend__containers__canvas-ship" ref={shipCanvasRef}></canvas>

      {tooltipVisible[0] && (
        <div
          className="asteroid-tooltipFirst"
          style={{ left: canvasDimensions.width, top: canvasDimensions.height }}
        >
          <div className='asteroid-info-label'>Name: {asteroidInformation.name} </div>
          <div className='asteroid-info-item'> Diameter: {asteroidInformation.diameter} Meters </div>
          <div className='asteroid-info-item'> Distance from Earth: {asteroidInformation.distanceFromEarth} AU </div>

          <Button className="startGame" onClick={ () => earthToRyugu( shipCanvasRef.current ) }>EXPLORE</Button>
        </div>
      )}
      {tooltipVisible[1] && (
        <div
          className="asteroid-tooltipastSecond"
          style={{ left: canvasDimensions.width, top: canvasDimensions.height }}
        >
          <div className="asteroid-info-label">
            Name: {asteroidInformation.name}{' '}
          </div>
          <div className="asteroid-info-item">
            {' '}
            Diameter: {asteroidInformation.diameter} Meters{' '}
          </div>
          <div className="asteroid-info-item">
            {' '}
            Distance from Earth: {asteroidInformation.distanceFromEarth} AU{' '}
          </div>
            <Button className="startGame" onClick={ () => ryuguToVesta( shipCanvasRef.current ) }>EXPLORE</Button>
        </div>
      )}
      {tooltipVisible[2] && (
        <div
          className="asteroid-tooltipThird"
          style={{ left: canvasDimensions.width, top: canvasDimensions.height }}
        >
          <div className="asteroid-info-label">
            Name: {asteroidInformation.name}{' '}
          </div>
          <div className="asteroid-info-item">
            {' '}
            Diameter: {asteroidInformation.diameter} Meters{' '}
          </div>
          <div className="asteroid-info-item">
            {' '}
            Distance from Earth: {asteroidInformation.distanceFromEarth} AU{' '}
          </div>
        
            <Button className="startGame" onClick={() => vestaToPsyche( shipCanvasRef.current ) }>EXPLORE</Button>
        </div>
      )}
      {tooltipVisible[3] && (
        <div
          className="asteroid-tooltipFourth"
          style={{ left: canvasDimensions.width, top: canvasDimensions.height }}
        >
          <div className="asteroid-info-label">
            Name: {asteroidInformation.name}{' '}
          </div>
          <div className="asteroid-info-item">
            {' '}
            Diameter: {asteroidInformation.diameter} Meters{' '}
          </div>
          <div className="asteroid-info-item">
            {' '}
            Distance from Earth: {asteroidInformation.distanceFromEarth} AU{' '}
          </div>
          
            <Button className="startGame" onClick={() => pycheToCeres( shipCanvasRef.current ) }>EXPLORE</Button>
        </div>
      )}
    </div>
  )
}
export default CanvasContainer