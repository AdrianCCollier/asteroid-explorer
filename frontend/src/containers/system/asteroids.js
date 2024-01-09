/**
 * Asteroids.js - Module for rendering asteroids on a canvas.
 * Provides functions to load images and draw them responsively.
 */


/**
 * Asynchronously loads an image from the given source URL.
 * @param {String} src - URL or path to the image file.
 * @returns {Promise<Image>} A promise that resolves with the loaded image.
 */
function loadAsteroidImage(src) {
  // Create a new promise for image loading
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}


/**
 * Draws asteroid images on a given canvas context.
 * @param {CanvasRenderingContext2D} context - The drawing context of the canvas.
 * @param {Number} canvasHeight - The height of the canvas.
 * @param {Number} canvasWidth - The width of the canvas.
 */
async function drawAsteroids(context, canvasHeight, canvasWidth) {
  const asteroids = [
    { src: './assets/Ryugu.png', x: 0.35, y: 0.6, scale: 11.5 },
    {
      src: './assets/Vesta.png',
      x: 0.494,
      y: 0.148,
      scale: 3.75,
    },
    { src: './assets/16Psyche.png', x: 0.68, y: 0.35, scale: 2.5 },
    { src: './assets/Ceres.png', x: 0.875, y: 0.3, scale: 4 },
  ]

  // Load all images and then draw them
  const images = await Promise.all(
    asteroids.map((a) => loadAsteroidImage(a.src))
  )

  images.forEach((img, index) => {
    const asteroid = asteroids[index]
    const scale = 256 / asteroid.scale
    context.drawImage(
      img,
      canvasWidth * asteroid.x,
      canvasHeight * asteroid.y,
      scale,
      scale
    )
  })
} // end drawAsteroids

export default drawAsteroids;
