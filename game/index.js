// This file holds the Game class, and contains the logic for a Phaser game

import {createPlayer, loadPlayerImage} from './player.js';
import {createAsteroid} from './asteroid.js';



var player;
var asteroid;
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
    loadPlayerImage(this);
}
    

// Create function (Draws assets, and adds any physics to them)
function create(){  
    // Will create the main world (asteroid) that the player and the aliens will be walking on
    asteroid = createAsteroid(this);

    // Calls create player to create the player with physics, and then returns into the game's player var  
    player = createPlayer(this);





    
    ///////////// Will handle canvas resizing depending on window resize /////////////

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
    // Call the handlePlayerMovement function to continuously check for input
    handlePlayerMovement(this);


    /*
    // Define the center point (the point of attraction)
    const centerX = this.physics.world.bounds.width / 2;
    const centerY = this.physics.world.bounds.height / 2;

    // Set up a constant gravitational force
    const gravitationalForce = 200;

    // In the update function, calculate the direction and apply the force
    const angle = Phaser.Math.Angle.Between(player.x, player.y, centerX, centerY);
    const forceX = Math.cos(angle) * gravitationalForce;
    const forceY = Math.sin(angle) * gravitationalForce;
    player.setAcceleration(forceX, forceY);*/
}


// Function to handle player movement
function handlePlayerMovement(scene) {
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

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