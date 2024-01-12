function loadEarthImage(src) {
  return new Promise((resolve, reject) => {
    const earthImage = new Image()
    earthImage.src = src // Correctly assign the source here
    earthImage.onload = () => resolve(earthImage)
    earthImage.onerror = reject
  })
}

async function drawEarth(context, canvasHeight, canvasWidth) {
  const earthSrc = './assets/Earth.png'

  // Load the Earth image
  const earthImage = await loadEarthImage(earthSrc)

  // Set Earth size and position (modify as needed)
  const earthSize = {
    width: 256, // Example size, adjust as required
    height: 256, // Example size, adjust as required
  }

  const earthPosition = {
    x: canvasWidth / 9 - earthSize.width / 2,
    y: canvasHeight / 2 - earthSize.height / 2,
  }

  // Draw the Earth image
  context.drawImage(
    earthImage,
    earthPosition.x,
    earthPosition.y,
    earthSize.width,
    earthSize.height
  )
}

export default drawEarth
