function drawEarth( context, canvasHeight, canvasWidth ) {
    
    // a method to draw the earth
        const x = canvasWidth * 0.95;
        const y = canvasHeight / 2;
        context.beginPath();
        context.moveTo( x, y );
        context.arc( x, y, 75, 0, Math.PI * 2);
        context.fillStyle = '#0076FF';
        context.fill();
        context.closePath();

}

export default drawEarth;