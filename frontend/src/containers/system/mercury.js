// This function is responsible for rendering, and positioning Mercury into our Canvas

function drawMercury(context, canvasHeight, canvasWidth) {
  // a method to draw the earth
  const x = canvasWidth * 0.33
  const y = canvasHeight / 2
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, 28.195, 0, Math.PI * 2)
  context.fillStyle = '#B1B1AC'
  context.fill()
  context.closePath()
}

export default drawMercury
