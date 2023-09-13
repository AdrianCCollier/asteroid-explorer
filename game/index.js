// This file holds the Game class, and contains the logic for a Phaser game

var player;
var velocity = 0;
var velocityLimit = 400;

// Game setup
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
    default: 'arcade', // sets the physics for the game
    arcade: {
        gravity: {y: 200} // sets gravity
    }
    },

    scene: { // sets the scene settings, in this case sets up scene with a preload function,
            // a create function. and the very important update function
    preload: preload,
    create: create,
    update: update
    }
}
    
// Sets up game using the config
let game = new Phaser.Game(config)

// Preload Function (Loads assets)
function preload(){
    // When loading an asset you assign it a keyword to reference it later on


    // Loads a local image in this case luffy jumping
    this.load.image('player', './assets/LuffyJumping.png');
}
    

// Create function (Draws assets, and adds any physics to them)
function create(){    
    
    // Draws Luffy with an initial (x, y) position of (400, 100)
    // Also specifies that the game's physics will effect this asset
    player = this.physics.add.image(400, 100, 'player')

    // Changes the width and height of Luffy and sets that new scale(size)
    const newWidth = player.width/4;
    const newHeight = player.height/4;
    player.setScale(newWidth / player.width, newHeight / player.height);

    // Applies more physics to Luffy, in this case sets his initial x velocity to 200, and his initial y velocity to 20
    // Sets his bounce level for his x and y, and makes it so that the bounds of the canvas makes him bouce
    player.setVelocity(0, 100)
    player.setBounce(0,0)
    player.setCollideWorldBounds(true)






    // Gets the Phaser canvas element
    const canvas = this.game.canvas;

    

    // Function to handle canvas resizing
    function resizeCanvas() {
        console.log(window.height);
        if (window.innerHeight > window.innerWidth){
            // Add an ID to the canvas element so that we can use CSS on it
            canvas.id = 'phaser-canvas-tall';
        }
        else{
            // Add an ID to the canvas element so that we can use CSS on it
            canvas.id = 'phaser-canvas-wide';
        }
    }

    // Initial canvas resizing
    resizeCanvas();

    // Add an event listener for window resize
    window.addEventListener('resize', resizeCanvas);
}


function update(){
    // Define variables for keyboard input
    const aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


    // Function to handle player movement
    function handlePlayerMovement() {

       

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

    // Call the handlePlayerMovement function to continuously check for input
    handlePlayerMovement();
}