import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import drawEarth from '../system/earth.js'
import drawAsteroids from '../system/Asteroids.js'
import './Canvas.css'

// Function to initialize our canvas container with placeholder values and data
function CanvasContainer({ asteroids }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [asteroidInformation, setAsteroidInformation] = useState({
    index: null,
    name: '',
    diameter: 0,
    distanceFromEarth: 0,
  })

  const [tooltipVisible, setTooltipVisible] = useState([
    false,
    false,
    false,
    false,
  ])

  // state to keep track of which asteroid was clicked, to load different phaser levels
  const [clickedAsteroidIndex, setClickedAsteroidIndex] = useState(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const backgroundImage = new Image();
    backgroundImage.src = './assets/Background.jpg';

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.77
      canvas.height = window.innerHeight * 0.785
      drawAsteroids(context, canvas.height, canvas.width);
      setCanvasDimensions({ width: canvas.width, height: canvas.height })

      backgroundImage.onload = () => {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
      };

      // drawEarth(context, canvas.height, canvas.width);
      drawAsteroids(context, canvas.height, canvas.width);


    }; // end resizeCanvas function

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // eventListener to handle the clicking of an asteroid
    canvas.addEventListener('click', function (e) {
      if (!asteroids || asteroids.length < 3) {
        return;
      } // end if

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      var ryuguX = canvas.width * 0.35
      var ryuguY = canvas.height * 0.6

      var vestaX = canvas.width * 0.511
      var vestaY = canvas.height * 0.18

      var ast3X = canvas.width * 0.7
      var ast3Y = canvas.height * 0.4

      var ast4X = canvas.width * 0.9
      var ast4Y = canvas.height * 0.45

      var rad1 = 15
      var rad2 = 35
      var rad3 = 25
      var ryuguRadius = 45

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
      else if (distance4 < ryuguRadius) {
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






























  // function to determine the visibility of our tool tip window when an asteroid is clicked
  const handleAsteroidClick = (index) => {
    setTooltipVisible((prevTooltipVisible) => {
      const updatedTooltipVisible = [...prevTooltipVisible]

      // loop to close all other tooltips before opening current tooltip
      for (let i = 0; i < updatedTooltipVisible.length; i++) {
        updatedTooltipVisible[i] = false
      } // end for

      // Open the tooltip with the updated visibility
      updatedTooltipVisible[index] = !updatedTooltipVisible[index]
      console.log('Inside handleAsteroidCLick const ' + index)
      return updatedTooltipVisible
    })
  }

  useEffect(() => {
    const mainCanvas = canvasRef.current

    // Calculate the location of each asteroid on the canvas, to ensure it can be clicked
    mainCanvas.addEventListener('mousemove', function (e) {
      var rect = mainCanvas.getBoundingClientRect() // getBoundingClientRect()
      var mouseX = e.clientX - rect.left
      var mouseY = e.clientY - rect.top

      // Coordinates are the same as in the drawAsteroids function
      var ast4X = mainCanvas.width * 0.35
      var ast5X = mainCanvas.width * 0.511
      var ast6X = mainCanvas.width * 0.7
      var ast7X = mainCanvas.width * 0.875

      var ast4Y = mainCanvas.height * 0.6
      var ast5Y = mainCanvas.height * 0.18
      var ast6Y = mainCanvas.height * 0.4
      var ast7Y = mainCanvas.height * 0.45

      // Calculate radii based on image dimensions (half of width or height)
      var ryuguRadius = 256 / 11.5 / 2
      var rad5 = 256 / 3.75 / 2
      var rad6 = 256 / 5 / 2
      var rad7 = 256 / 2.7 / 2

      var distance4 = Math.sqrt((mouseX - ast4X) ** 2 + (mouseY - ast4Y) ** 2)
      var distance5 = Math.sqrt((mouseX - ast5X) ** 2 + (mouseY - ast5Y) ** 2)
      var distance6 = Math.sqrt((mouseX - ast6X) ** 2 + (mouseY - ast6Y) ** 2)
      var distance7 = Math.sqrt((mouseX - ast7X) ** 2 + (mouseY - ast7Y) ** 2)

      // check if mouse is inside any of the circles
      if (
        distance4 < ryuguRadius ||
        distance5 < rad5 ||
        distance6 < rad6 ||
        distance7 < rad7
      ) {
        mainCanvas.style.cursor = 'pointer'
      } else {
        mainCanvas.style.cursor = 'default'
      }
    })
  }, [canvasRef])


  return (
    <div className="frontend__containers__canvas">
      <canvas id="frontend__containers__canvas__init" ref={canvasRef}></canvas>


      {tooltipVisible[0] && (
        <div
          className="asteroid-tooltipFirst"
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
          <Button className="startGame" onClick={() => navigate('/level0')}>
            EXPLORE
          </Button>
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
          <Button className="startGame" onClick={() => navigate('/level1')}>
            EXPLORE
          </Button>
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
          <Button className="startGame" onClick={() => navigate('/level2')}>
            EXPLORE
          </Button>
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
          <Button className="startGame" onClick={() => navigate('/level3')}>
            EXPLORE
          </Button>
        </div>
      )}
    </div>
  )
}
export default CanvasContainer
