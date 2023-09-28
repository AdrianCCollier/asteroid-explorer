// This file holds the Game class, and contains the logic for a Phaser game

import {createPlayer, loadPlayerImage} from './player.js';
import {createAsteroid, applyRotation} from './asteroid.js';



var player;
var asteroid;


// Game setup
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
    default: 'arcade', // sets the physics for the game
    arcade: {
        gravity: {y: 0} // sets gravity
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
    // Loads a local image in this case a robot sprite that is 64x64 pixels
    loadPlayerImage(this);
}
    

// Create function (Draws assets, and adds any physics to them)
function create(){
    // Will create the main world (asteroid) that the player and the aliens will be walking on
    asteroid = createAsteroid(this, game, 121);

    // Calls create player to create the player with physics, and then returns into the game's player var  
    player = createPlayer(this, asteroid, 64, 64);




    ///////////// Will handle canvas resizing depending on window resize /////////////
    // Gets the Phaser canvas element
    const canvas = this.game.canvas;
    // Function to handle canvas resizing
    function resizeCanvas() {
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
    handlePlayerMovement(this);
}


// Vars for player movement
var jumpTimer = 55;
var frameCounter = 0;
var jumping = false;
var falling = false;
var spaceUp = false;


// Function to handle player movement
function handlePlayerMovement(scene) {
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Move left
    if (aKey.isDown) {
        player.angle -= 1;
    }

    // Move right
    if (dKey.isDown){
        player.angle += 1;
    }

    // Jump
    if (spaceKey.isDown && !jumping && !falling && spaceUp){
        jumping = true;
    }

    // Checks for player not holding space for jumping
    if (!spaceKey.isDown){
        spaceUp = true;
    }
    else{
        spaceUp = false;
    }

    // Handles jumping
    if (jumping){
        frameCounter += 1;
        if (frameCounter >= jumpTimer){
            jumping = false;
            falling = true;
            frameCounter = 0;
        }
        else{
            player.vertical += player.gravity;
        }
    }

    // handles falling
    if (falling){
        player.vertical -= player.gravity;
        console.log(player.collider.y);

        // Check for collision
        if ((Phaser.Geom.Intersects.CircleToCircle(asteroid.collider, player.collider))){
            falling = false;

            // Resets player position
            player.vertical = (player.realDistance / 64) + 0.5;
        }
    }


    // Updates player rotation angle
    player.rotation.updateTo('angle', player.angle);

    // updates player's vertical positon
    player.sprite.setOrigin(0.5, player.vertical);

    // Calculates the real distance to the center of the asteroid, in regards to the player
    player.realDistance = (player.vertical - 0.5) / 1 * 64;

    // Calculates the x, and y positions of the player sprite
    player.x = asteroid.x + (player.realDistance * Math.cos((player.angle - 90) * (Math.PI / 180)));
    player.y = asteroid.y + (player.realDistance * Math.sin((player.angle - 90) * (Math.PI / 180)));

    // Updates the player collider position
    player.collider.x = player.x;
    player.collider.y = player.y;
}