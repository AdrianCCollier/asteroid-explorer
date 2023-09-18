function drawSun( context, canvasHeight ) {
    context.beginPath();
    context.moveTo(0, canvasHeight);
    context.arc(0, canvasHeight, 600, 1.5 * Math.PI, 0);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
}

export default drawSun;