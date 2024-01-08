

// This function is responsible for rendering, and positioning the asteroids inside our canvas
function drawAsteroids( context, canvasHeight, canvasWidth ) {

  // Create new Image objects
  const ryuguImage = new Image()
  const vestaImage = new Image()
  const psyche16Image = new Image()
  const ceresImage = new Image()
  
  // Link each Image to its png path
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
}

export default drawAsteroids