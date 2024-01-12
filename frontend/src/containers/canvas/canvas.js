import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import drawEarth from '../system/Earth.js'
import drawAsteroids from '../system/Asteroids.js'
import './Canvas.css'

// Function to initialize our canvas container with placeholder values and data
function CanvasContainer({ asteroids }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [asteroidInformation, setAsteroidInformation] = useState({
    index: null,
    name: '',
    diameter: 0,
    distanceFromEarth: 0,
  })

  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0
  });

  const [tooltipVisible, setTooltipVisible] = useState([
    false,
    false,
    false,
    false,
  ])

  const [clickedAsteroidIndex, setClickedAsteroidIndex] = useState(null)

  const calculateAsteroidPositions = (width, height) => {
    return asteroids.map(asteroid => ({
      x: width * asteroid.x,
      y: height * asteroid.y,
      radius: 256 / asteroid.scale / 2,
    }));
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const backgroundImage = new Image()
    backgroundImage.src = './assets/Background.jpg'

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.77
      canvas.height = window.innerHeight * 0.785
      context.clearRect(0, 0, canvas.width, canvas.height)
      drawAsteroids(context, canvas.height, canvas.width)
      drawEarth(context, canvas.height, canvas.width)
      setCanvasDimensions({ width: canvas.width, height: canvas.height })

      backgroundImage.onload = () => {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
      }

      
      drawAsteroids(context, canvas.height, canvas.width)
      drawEarth(context, canvas.height, canvas.width)

    } // end resizeCanvas function

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas();
    
    // eventListener to handle the clicking of an asteroid
    canvas.addEventListener('click', function (e) {
      if (!asteroids || asteroids.length < 3) {
        return
      } // end if

      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const canvasWidth = canvasRef.current.width
      const canvasHeight = canvasRef.current.height

      const asteroidPositions = [
        { x: 0.3, y: 0.6, radius: 15 },
        { x: 0.5, y: 0.15, radius: 35 },
        { x: 0.6, y: 0.35, radius: 25 },
        { x: 0.9, y: 0.45, radius: 45 },
      ];



      for(let i = 0; i < asteroidPositions.length; i++) {
        const asteroid = asteroidPositions[i];
        const asteroidX = canvasWidth * asteroid.x;
        const asteroidY = canvasHeight * asteroid.y;

        const distance = Math.sqrt(
          (mouseX - asteroidX) ** 2 + (mouseY - asteroidY) ** 2
        ); 

        if(distance < asteroid.radius) {
          console.log(`Asteroid ${i} clicked`);
          setAsteroidInformation({
            name: asteroids[i].name,
            diameter: asteroids[i].diameter,
            distanceFromEarth: asteroids[i].distanceFromEarth,
          });
          handleAsteroidClick(i);
          setClickedAsteroidIndex(i);
          break;
        } // end if statement
      } // end for loop
    }) // end click event listener

    // working event listener to resize the canvas
    // Asteroids will not be displayed after the canvas is resized
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [asteroids])

  // function to determine the visibility of our tool tip window when an asteroid is clicked
  const handleAsteroidClick = (index, asteroidX, asteroidY) => {
    setTooltipVisible((prevTooltipVisible) => {
      const updatedTooltipVisible = prevTooltipVisible.map(
        (_, idx) => idx === index
      )
      return updatedTooltipVisible
    })
    setTooltipPosition({ x: asteroidX, y: asteroidY }) // Store asteroid position
  };

  useEffect(() => {
    const mainCanvas = canvasRef.current

    // Calculate the location of each asteroid on the canvas, to ensure it can be clicked
    mainCanvas.addEventListener('mousemove', function (e) {
      var rect = mainCanvas.getBoundingClientRect() 
      var mouseX = e.clientX - rect.left
      var mouseY = e.clientY - rect.top

      // Coordinates are the same as in the drawAsteroids function
      var ast4X = mainCanvas.width * 0.3
      var ast5X = mainCanvas.width * 0.5
      var ast6X = mainCanvas.width * 0.6
      var ast7X = mainCanvas.width * 0.9

      var ast4Y = mainCanvas.height * 0.6
      var ast5Y = mainCanvas.height * 0.15
      var ast6Y = mainCanvas.height * 0.35
      var ast7Y = mainCanvas.height * 0.45

      // Calculate radii based on image dimensions (half of width or height)
      var ryuguRadius = 256 / 15/ 2
      var rad5 = 256 / 2.5 / 2
      var rad6 = 256 / 2.75 / 2
      var rad7 = 256 / 1.8 / 2

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
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
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
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
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
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
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
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
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
