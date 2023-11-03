function drawAsteroids( context, canvasHeight, canvasWidth ) {
    
    // first asteroid
    var centerX = canvasWidth * 0.75;
    var centerY = canvasHeight / 1.25;
    context.beginPath();
    context.arc( centerX, centerY, 15, 0, Math.PI * 2);
    context.fillStyle = '#71716D';
    context.fill();
    context.closePath();

    // second asteroid
    centerX = canvasWidth * 0.25;
    centerY = canvasHeight * 0.1;
    context.beginPath();
    context.moveTo( centerX, centerY );
    context.arc( centerX, centerY, 12, 0, Math.PI * 2);
    context.fillStyle = '#71716D';
    context.fill();
    context.closePath();

    // third asteroid
    centerX = canvasWidth / 1.08;
    centerY = canvasHeight / 5;
    context.beginPath();
    context.moveTo( centerX, centerY );
    context.arc( centerX, centerY, 25, 0, Math.PI * 2);
    context.fillStyle = '#71716D';
    context.fill();
    context.closePath();

}

export default drawAsteroids