function drawEarth( context, canvasHeight, canvasWidth ) {
    // Create an image element for the Earth sprite
    const earthImage = new Image();
    earthImage.src = './assets/Earth.png';

    // Wait for the image to load before drawing it
    earthImage.onload = function() {
        // Draw the Earth sprite on the canvas
        context.drawImage(earthImage, canvasWidth - canvasWidth / 20, (canvasHeight / 2) - ((256 / 12) / 2), 256/12, 256/12); // Adjust the size and position as needed
    };

}

export default drawEarth;