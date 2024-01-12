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

async function animateAsteroids(
  context,
  canvasHeight,
  canvasWidth,
  asteroids,
  images
) {
  let time = 0;
  const maxGlowSize = 0.55;
  const minGlowSize = 0.15;
  const glowSpeed = 0.25;

  const draw = () => {
    // Calculate current glow size using a sine wave for smooth transition
    const currentGlowSize =
      minGlowSize + ((maxGlowSize - minGlowSize) * (Math.sin(time) + 1)) / 2
    time += glowSpeed

    images.forEach((img, index) => {
      const asteroid = asteroids[index]
      const scale = 256 / asteroid.scale

      // Set glow properties
      context.save()
      context.shadowBlur = currentGlowSize
      context.shadowColor = `rgba(0, 210, 255, 0.5)`

      context.drawImage(
        img,
        canvasWidth * asteroid.x - scale / 2,
        canvasHeight * asteroid.y - scale / 2,
        scale,
        scale
      )
      context.restore()
    })

    requestAnimationFrame(draw)
  }

  draw()
}

/**
 * Draws asteroid images on a given canvas context.
 * @param {CanvasRenderingContext2D} context - The drawing context of the canvas.
 * @param {Number} canvasHeight - The height of the canvas.
 * @param {Number} canvasWidth - The width of the canvas.
 */
async function drawAsteroids(context, canvasHeight, canvasWidth) {
  const asteroids = [
    { src: './assets/Ryugu.png', x: 0.3, y: 0.6, scale: 15 },
    {
      src: './assets/Vesta.png',
      x: 0.5,
      y: 0.15,
      scale: 2.5,
    },
    { src: './assets/16Psyche.png', x: 0.6, y: 0.35, scale: 2.75 },
    { src: './assets/Ceres.png', x: 0.9, y: 0.45, scale: 1.8 },
  ]

  // Load all images and then draw them
  const images = await Promise.all(
    asteroids.map((a) => loadAsteroidImage(a.src))
  )

  animateAsteroids(context, canvasHeight, canvasWidth, asteroids, images)
} // end drawAsteroids

export default drawAsteroids
