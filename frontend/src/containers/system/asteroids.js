function drawAsteroids( context, canvasHeight, canvasWidth ) {
  // first asteroid - Ryugu
  var centerX = canvasWidth * 0.35
  var centerY = canvasHeight * 0.6
  context.beginPath()
  context.arc(centerX, centerY, 15, 0, Math.PI * 2)
  context.fillStyle = '#71716D'
  context.fill()
  context.closePath()

  // second asteroid - Vesta
  centerX = canvasWidth * 0.5
  centerY = canvasHeight * 0.2
  context.beginPath()
  context.moveTo(centerX, centerY)
  context.arc(centerX, centerY, 12, 0, Math.PI * 2)
  context.fillStyle = '#71716D'
  context.fill()
  context.closePath()

  // third asteroid - Psyche 16
  centerX = canvasWidth * 0.7
  centerY = canvasHeight * 0.4
  context.beginPath()
  context.moveTo(centerX, centerY)
  context.arc(centerX, centerY, 25, 0, Math.PI * 2)
  context.fillStyle = '#71716D'
  context.fill()
  context.closePath()

  // fourth asteroid - Ceres
  centerX = canvasWidth * 0.9
  centerY = canvasHeight * 0.45
  context.beginPath()
  context.moveTo(centerX, centerY)
  context.arc(centerX, centerY, 45, 0, Math.PI * 2)
  context.fillStyle = '#71716D'
  context.fill()
  context.closePath()
}

export default drawAsteroids