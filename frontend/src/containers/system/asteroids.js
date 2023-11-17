function drawAsteroids( context, canvasHeight, canvasWidth ) {
  // first asteroid - Ryugu
  

  const ryuguImage = new Image()
  const vestaImage = new Image()
  const psyche16Image = new Image()
  const ceresImage = new Image()

  ryuguImage.src = './assets/Ryugu.png'
  vestaImage.src = './assets/Vesta.png'
  psyche16Image.src = './assets/16Psyche.png'
  ceresImage.src = './assets/Ceres.png'

  // wait for the image to load before drawing it
  ryuguImage.onload = function() {
    // draw the Ryugu image on the canvas
    context.drawImage( ryuguImage, canvasWidth * 0.344 , canvasHeight * 0.59, 256/11.5, 256/11.5);
  };

  vestaImage.onload = function() {
    // draw the Vesta image on the canvas
    context.drawImage( vestaImage, canvasWidth * 0.494 , canvasHeight * 0.148, 256/3.75, 256/3.75);
  };

  psyche16Image.onload = function() {
    // draw the Psyche-16 image on the canvas
    context.drawImage( psyche16Image, canvasWidth * 0.686 , canvasHeight * 0.373, 256/5, 256/5);
  };

  ceresImage.onload = function() {
    // draw the Ceres image on the canvas
    context.drawImage( ceresImage, canvasWidth * 0.875 , canvasHeight * 0.403, 256/2.7, 256/2.7);
  };

  // keeping commented out for debuging
  /*
  var centerX = canvasWidth * 0.35
  var centerY = canvasHeight * 0.6
  context.beginPath()
  context.moveTo(centerX, centerY)
  context.arc(centerX, centerY, 12, 0, Math.PI * 2)
  context.fillStyle = '#71716D'
  context.fill()
  context.closePath()

  // second asteroid - Vesta
  centerX = canvasWidth * 0.511
  centerY = canvasHeight * 0.18
  context.beginPath()
  context.moveTo(centerX, centerY)
  context.arc(centerX, centerY, 35, 0, Math.PI * 2)
  context.fillStyle = '#71716D'
  context.fill()
  context.closePath()

  // third asteroid - Psyche 16
  centerX = canvasWidth * 0.699
  centerY = canvasHeight * 0.4
  context.beginPath()
  context.moveTo(centerX, centerY)
  context.arc(centerX, centerY, 24, 0, Math.PI * 2)
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
  */
}

export default drawAsteroids