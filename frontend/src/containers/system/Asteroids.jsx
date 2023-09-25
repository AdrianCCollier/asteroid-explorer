import { useEffect } from 'react';

function Asteroids({ canvasRef }) {

    console.log( 'Inside asteroids')
    useEffect( () => {
        const canvas = canvasRef.current;
        const context = canvasRef.current.getContext('2d');

        drawAsteroids( context, canvas.height, canvas.width, canvas );
    }, [canvasRef]);

    return null;
}

function drawAsteroids( context, canvasHeight, canvasWidth, canvas ) {

    console.log( "inside draw asteroids");

    // code may be replaced if we decide to plot the asteroids in their actual positions
    
    // first asteroid
    var centerX = canvasWidth * 0.75;
    var centerY = canvasHeight / 1.25;
    context.beginPath();
    context.arc( centerX, centerY, 15, 0, Math.PI * 2);
    context.fillStyle = '#71716D';
    context.fill();
    context.closePath();

    centerX = canvasWidth * 0.25;
    centerY = canvasHeight * 0.1;
    context.beginPath();
    context.moveTo( centerX, centerY );
    context.arc( centerX, centerY, 12, 0, Math.PI * 2);
    context.fillStyle = '#71716D';
    context.fill();
    context.closePath();

    centerX = canvasWidth / 1.08;
    centerY = canvasHeight / 5;
    context.beginPath();
    context.moveTo( centerX, centerY );
    context.arc( centerX, centerY, 25, 0, Math.PI * 2);
    context.fillStyle = '#71716D';
    context.fill();
    context.closePath();
    
    
    canvas.addEventListener( "mousemove", function(e) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        var ast1X = canvasWidth * 0.75;
        var ast1Y = canvasHeight / 1.25;
        var ast2X = canvasWidth * 0.25;
        var ast2Y = canvasHeight * 0.1;
        var ast3X = canvasWidth / 1.08;
        var ast3Y = canvasHeight / 5;
        var rad1 = 15;
        var rad2 = 12;
        var rad3 = 25;

        // calculate the distance from the mouse to each asteroids center
        var distance1 = Math.sqrt(( mouseX - ast1X ) ** 2 + ( mouseY - ast1Y ) ** 2);
        var distance2 = Math.sqrt(( mouseX - ast2X ) ** 2 + ( mouseY - ast2Y ) ** 2);
        var distance3 = Math.sqrt(( mouseX - ast3X ) ** 2 + ( mouseY - ast3Y ) ** 2);

        // check if mouse is inside any of the circles
        if( distance1 < rad1 || distance2 < rad2 || distance3 < rad3 ) {
            canvas.style.cursor = "pointer";
        }
        else {
            canvas.style.cursor = "default";
        }
    });
    
}

export default Asteroids;