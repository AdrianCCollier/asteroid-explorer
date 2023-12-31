// This function is responsible for rendering, and positioning Venus into our Canvas

function drawVenus(context, canvasHeight, canvasWidth) {
  // Set x, y coordinates, and draw circle shape
  const x = canvasWidth * 0.66
  const y = canvasHeight / 2
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, 70.75, 0, Math.PI * 2)
  context.fillStyle = '#C57F00'
  context.fill()
  context.closePath()
}

export default drawVenus
