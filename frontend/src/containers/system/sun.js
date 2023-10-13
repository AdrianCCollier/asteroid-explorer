function drawSun( context, canvasHeight ) {
    context.beginPath();
    context.moveTo(-400, canvasHeight / 2 );
    context.arc(-400, canvasHeight / 2, 500, 3 * Math.PI / 2, Math.PI / 2);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
}

export default drawSun;