function loadEarthImage(src) {
  return new Promise((resolve, reject) => {
    const earthImage = new Image()
    earthImage.src = src 
    earthImage.onload = () => resolve(earthImage)
    earthImage.onerror = reject
  })
}

async function drawEarth(context, canvasHeight, canvasWidth) {
  const earthSrc = './assets/Earth.png'

  // Load the Earth image
  const earthImage = await loadEarthImage(earthSrc)

  const earthSize = {
    width: 256, 
    height: 256, 
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
