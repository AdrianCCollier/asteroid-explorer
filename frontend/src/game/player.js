export function createPlayer(scene){
    // Draws Luffy with an initial (x, y) position of (400, 100)
    // Also specifies that the game's physics will effect this asset
    var player = scene.physics.add.image(400, 100, 'player')

    // Applies more physics to Luffy, in this case sets his initial x velocity to 200, and his initial y velocity to 20
    // Sets his bounce level for his x and y, and makes it so that the bounds of the canvas makes him bouce
    player.setVelocity(0, 0)
    player.setCollideWorldBounds(true)


    // Changes the width and height of Luffy and sets that new scale(size)
    const newWidth = player.width/16;
    const newHeight = player.height/16;
    player.setScale(newWidth / player.width, newHeight / player.height);

    return player;
}



export function loadPlayerImage(scene){
    scene.load.image('player', './assets/LuffyJumping.png');
}


export function handlePlayerMovement(player, aKey, dKey, velocity, velocityLimit){
    // Stop horizontal movement when neither left nor right is pressed
    if (!aKey.isDown && !dKey.isDown) {
        if (velocity > 0){
            velocity -= 25;
        }
        else if (velocity < 0){
            velocity += 25;
        }
    }

    // Move left
    if (aKey.isDown) {
        if (velocity > velocityLimit * -1)
            velocity -= 25;
    }

    // Move right
    if (dKey.isDown) {
        if (velocity < velocityLimit)
            velocity += 25;
    }

    player.setVelocityX(velocity); // Adjust the velocity as needed
}