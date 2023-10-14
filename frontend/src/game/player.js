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
        collider: null // Player's collider circle
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



export function handlePlayerMovement(scene, player, asteroid, shootControl, shootCooldown) {
    // defines key inputs
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const kKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    
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
        angle: 0, 
        gravity: 0.4 ,
        hasWeapon: false,
        canShoot: false,
        sprite: playerSprite,
        rotation: null,
        collider: null
    };

    // Add a gun sprite if the player picks one up
    player.gunSprite = scene.add.sprite(player.x, player.y, 'weapon');
    player.gunSprite.setVisible(false);

    // Set the player's collider
    player.collider = new Phaser.Geom.Circle(player.x, player.y, player.width / 2);

    return player;
}

export function handlePlayerMovementInside(scene, player, shootControl, shootCooldown) {
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const kKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    var jumpTimer = 55;
    var frameCounter = 0;
    var jumping = false;
    var falling = false;
    const speed = 3;
    if (kKey.isDown && shootControl.canShoot){
        let bullet = createBulletInside(scene, player, 20, 20);
        scene.bullets.push(bullet); // Create a bullet when K is pressed
        shootControl.canShoot = false;
        setTimeout(() => {shootControl.canShoot = true;}, shootCooldown);
    }

    // Move left
    if (aKey.isDown) {
        player.sprite.x -= speed;
    }

    // Move right
    if (dKey.isDown){
        player.sprite.x += speed;
    }

    if (spaceKey.isDown){
        player.sprite.y -= speed;
    }


    // Updates the player collider position
    player.collider.x = player.x;
    player.collider.y = player.y;
}