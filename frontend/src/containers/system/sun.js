// This function is responsible for rendering, and positioning the Sun into our Canvas

function drawSun(context, canvasHeight) {
  // Create an image element for the Sun sprite
  const sunImage = new Image()
  sunImage.src = './assets/Sun.png'

  // Wait for the image to load before drawing it
  sunImage.onload = function () {
    // Draw the Sun sprite on the canvas
    console.log('inside on load sun')
    context.drawImage(
      sunImage,
      -236,
      canvasHeight / 2 - 256 * 0.75,
      256 * 1.5,
      256 * 1.5
    ) // Adjust the size and position as needed
  }
}

export default drawSun
