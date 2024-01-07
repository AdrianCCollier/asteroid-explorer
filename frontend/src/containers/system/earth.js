
function drawEarth( context, canvasHeight, canvasWidth, earthImage) {
    
    
    if(!earthImage) {
        console.log('Earth image not provided or failed to load');
        return;
    }

    const earthSize = { 
        width: 256 * 2, 
        height: 256 * 2
    };

    const earthPosition = { 
        x: -236, 
        y: (canvasHeight / 2) - (earthSize.height * 0.75)
    };

    context.drawImage(earthImage, earthPosition.x, earthPosition.y, earthSize.width, earthSize.height);

}

export default drawEarth;

