function drawEarth( context, canvasHeight, canvasWidth ) {
    // Create an image element for the Earth sprite
    const earthImage = new Image();
    earthImage.src = './assets/Earth.png';

    // Wait for the image to load before drawing it
    earthImage.onload = function() {
        // Draw the Earth sprite on the canvas
        context.drawImage(earthImage, canvasWidth * 0.25 , (canvasHeight / 2) - (256 / 24 - 110), 256/12, 256/12); 
    };

}

export default drawEarth;