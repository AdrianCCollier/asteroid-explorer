import {createAsteroid, applyRotation} from './asteroid.js';
import { createBullet, createBulletInside, handleBulletMovements, loadBulletImage } from './bullet.js';

import Phaser from 'phaser';

export function createPlayer(scene, asteroid, w, h) {
    let player = {
        x: asteroid.x, // Sprite's x position
        y: asteroid.y, // Sprite's y position
        width: w, // Sprite's width
        height: h, // Sprite's height
        angle: 0, // Player's angle to the center of asteroid
        vertical: 2.75, // Distance to center of asteroid for setOrigin function()
        realDistance: asteroid.radius, // Real distance to center of asteroid
        gravity: 0.044, // Player gravity
        hasWeapon: false,
        canShoot: false,
        sprite: scene.add.sprite(asteroid.x, asteroid.y, 'player'),
        rotation: null, // Player's tween rotation
        collider: null, // Player's collider circle
        jumps: 0,  // added for jump boost
        maxJumps: 2 ,
        isBoosting: false, // This property will check if the player is boosting

    };

    // Applies the player's rotation
    player.rotation = applyRotation(scene, player);

    // Set's initial player distance to the surface of the asteroid
    const verticalOrigin = (1 + (asteroid.radius / (player.width / 2))) / 2 + 0.5;
    player.sprite.setOrigin(0.5, verticalOrigin);

    // gets ready to add a gun sprite if the player pics one up
    player.gunSprite = scene.add.sprite(player.x, player.y, 'weapon'); 
    player.gunSprite.setVisible(false); 
    
    player.vertical = verticalOrigin;

    // Sets the player's collider
    player.collider = new Phaser.Geom.Circle(player.x, player.y, player.width / 2);
    return player;
}

// Vars for player movement
var jumpTimer = 10;
var frameCounter = 0;
var jumping = false;
var falling = false;
var spaceUp = false;
var movingForward = false;
var movingBackward = false;



export function handlePlayerMovement(scene, player, asteroid, shootControl, shootCooldown) {
    // defines key inputs
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const kKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    const bKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey);
  const bKeyJustPressed = Phaser.Input.Keyboard.JustDown(this.bKey);
    
    if (kKey.isDown && shootControl.canShoot && player.hasWeapon){
        let bullet = createBullet(scene, player, 20, 20);
        scene.bullets.push(bullet); // Create a bullet when K is pressed
        shootControl.canShoot = false;
        setTimeout(() => {shootControl.canShoot = true;}, shootCooldown);
    }

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

export function loadPlayerImage(scene){
    scene.load.image('player', './assets/Skeleton.png');
}

export function createPlayerInside(scene, x, y) {
    // Create the player sprite with physics body
    var playerSprite = scene.physics.add.sprite(x, y, 'player');

    // Enable physics on the player sprite
    scene.physics.world.enable(playerSprite);

    let player = {
        x: x,
        y: y,
        width: playerSprite.width,
        height: playerSprite.height,
        health: 100,
        angle: 0, 
        health: 100, 
        gravity: 0.4 ,
        hasWeapon: false,
        canShoot: false,
        sprite: playerSprite,
        rotation: null,
        collider: null,
        facing: 'right', // Default facing direction 
        animator: null, // variable that holds player's current animation
        boostAnimator: null, // variable that holds player's booster animations
        gunAnimator: null, // variable that holds player's gun animations
        jumping: false,
        doubleJumping: false,
        idle: false,
        walking: false
        
    };

    // Add a gun sprite if the player picks one up
    player.gunSprite = scene.add.sprite(player.x, player.y, 'weapon1');
    player.gunSprite.setVisible(false);

    // Set the player's collider
    player.collider = new Phaser.Geom.Circle(player.x, player.y, player.width / 2);

    return player;
}

export function handlePlayerMovementInside(scene, player, shootControl, shootCooldown) {
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const kKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    const bKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    var jumpTimer = 55;
    var frameCounter = 0;
    var jumping = false;
    var doubleJump = false; // flag to check if double jump is available
    var falling = false;
    const speed = 3;
    const gravity = 1.5; // gravity strength, increase to make the player fall faster
    const jumpStrength = 5; // jump strength, increase to jump higher
    player.velocityY = 0; // vertical velocity of the player

    if (kKey.isDown && shootControl.canShoot){
        let bullet = createBulletInside(scene, player, 20, 20);
        scene.bullets.push(bullet); // Create a bullet when K is pressed
        shootControl.canShoot = false;
        setTimeout(() => {shootControl.canShoot = true;}, shootCooldown);
    }

    // Move left
    if (aKey.isDown) {
        player.sprite.x -= speed;
        
        // Only updates the direction if the dKey hasn't been pressed
        if (!dKey.isDown)
        player.facing = 'left'; // Update facing direction
    }

    // Move right
    if (dKey.isDown){
        player.sprite.x += speed;

        // Only updates the direction if the aKey hasn't been pressed
        if (!aKey.isDown)
            player.facing = 'right'; // Update facing direction
    }

    // Checking to see if player is walking in general
    if (aKey.isDown || dKey.isDown){
        player.walking = true;
    }
    else{
        player.walking = false;
    }


    // Regular jump
    if (spaceKey.isDown && !jumping) {
        player.velocityY = -jumpStrength; // going up
        jumping = true;
        player.jumping = true;
    }

    // Double jump
    if (bKey.isDown && spaceKey.isDown) {
        player.velocityY = -jumpStrength*1.8; // going up

        doubleJump = true;
        player.doubleJumping = true;
    }

    player.velocityY += gravity; // gravity pulls down
    player.sprite.y += player.velocityY; // apply the current velocity to Y position (vertical movement)

    // Check for landing - replace this with your actual collision detection logic
    if (!jumping) {
        jumping = false;
        player.jumping = false;

        doubleJump = false;
        player.doubleJumping = false;

        player.velocityY = 0;
    }

    // Updates the player collider position
    player.collider.x = player.sprite.x;
    player.collider.y = player.sprite.y;
}

export function animationCreator(scene, w, a, s, d, space){
    // Check for D key
    scene.input.keyboard.on("keydown-D", () => {
        d = true;
    });
    scene.input.keyboard.on("keyup-D", () => {
    d = false;
    scene.walk.anims.stop();
    });

    // Check for A key
    scene.input.keyboard.on("keydown-A", () => {
        a = true;
    });
    scene.input.keyboard.on("keyup-A", () => {
    a = false;
    //scene.walk.anims.stop();
    });

    // check for S key
    scene.input.keyboard.on("keydown-S", () => {
        s = true;
    });
    scene.input.keyboard.on("keyup-S", () => {
    s = false;
    //scene.walk.anims.stop();
    });

    // Check for W key
    scene.input.keyboard.on("keydown-W", () => {
        w = true;
    });
    scene.input.keyboard.on("keyup-W", () => {
    w = false;
    //scene.walk.anims.stop();
    });


        //this.walk.setFlipX(true);
        if (d) {
            scene.walk.anims.play("player_walk", true);
          } else {
            scene.walk.anims.stop();
          }
}

export function handlePlayerDamage(player, amount) {
    player.health -= amount;
    if (player.health <= 0) {
        // Trigger game over, respawn, etc.
        player.health = 0; // Ensure health doesn't go negative
        console.log("Player is dead!"); // Replace with your game over logic
    }
}