// This function is responsible for rendering, and positioning Earth into our Canvas
function drawEarth( context, canvasHeight, canvasWidth ) {
    // Create an image element for the Earth sprite
    const earthImage = new Image();
    earthImage.src = './assets/Earth.png';

    // Wait for the image to load before drawing it
    earthImage.onload = function() {
        // Draw the Earth sprite on the canvas
        context.drawImage(earthImage, -236, ( canvasHeight / 2 ) - ( 256 * 0.75 ), 256 * 2, 256 * 2); 
    };

}

export default drawEarth;