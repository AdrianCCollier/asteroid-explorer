import React, {useRef, useEffect } from 'react';
import drawSun from '../system/sun';
import drawEarth from '../system/earth';
import drawAsteroids from '../system/asteroids';

  // Adrian, 9/22. added asteroids as a prop here, being passed down from Solar.js, its coming all the way from localhost:3000/asteroids, it was sent to Solar.js, and now here. The goal is to display actual asteroid data when an asteroid is clicked, so its going to asteroids.js next
function CanvasContainer({asteroids}) {


  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const resizeCanvas = () => {
      const solarContent = document.querySelector('.solar__content')
      canvas.width = solarContent.clientWidth * 0.99
      canvas.height = solarContent.clientHeight * 0.98

      context.fillStyle = 'black'
      context.fillRect(0, 0, canvas.width, canvas.height)

      drawSun(context, canvas.height)
      drawEarth(context, canvas.height, canvas.width)
      drawAsteroids(context, canvas.height, canvas.width, asteroids)
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [asteroids]) // Add asteroids as a dependency here so the effect reruns when asteroids change

  return <canvas id="frontend__containers__canvas" ref={canvasRef}></canvas>
}

export default CanvasContainer;