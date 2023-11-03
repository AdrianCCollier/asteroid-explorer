import {createAsteroid, applyRotation} from './asteroid.js';
import { createBullet, createBulletInside, handleBulletMovements, loadBulletImage } from './bullet.js';

import Phaser from 'phaser';

import fireSound from './assets/sounds/fireSound.mp3'

export function loadWeaponSounds(scene) {
  scene.load.audio('weaponFireSound', fireSound)
}

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
///
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
        health: 3, 
        gravity: 0.4 ,
        hasWeapon: false,
        canShoot: false,
        sprite: playerSprite,
        rotation: null,
        collider: null,
        facing: 'right', // Default facing direction 
        healthContainer: scene.add.sprite(160, 43, 'health_container'),
        healthBar: scene.add.sprite(170, 43, 'health_bar'),
        shieldContainer: scene.add.sprite(160, 110, 'shield_container'),
        shieldBar: scene.add.sprite(191, 111, 'shield_bar'),
        barOffsets: [160, 43, 191, 43, 160, 110, 191, 111],
        animator: null, // player's current main animation
        shootingAnimator: null, // player's current main animation while shooting
        boostAnimator: null, // booster animations
        gunAnimator: null, // gun animations
        armAnimator: null, // arm animations
        strapAnimator: null, // strap animation
        weaponSprite: null,
        weaponHolsteredSprite: null,
        jumping: false,
        doubleJumping: false,
        idle: false,
        walking: false,
        shoot: false,
        unholstering: false,
        holstered: true,
        holstering: false,
    };

    player.healthBar.setScale(2);
    player.healthContainer.setScale(2);
    player.shieldBar.setScale(2);
    player.shieldContainer.setScale(2);
    player.healthBar.setOrigin(0, 0.5 );

    // Add a gun sprite if the player picks one up
    player.gunSprite = scene.add.sprite(player.x, player.y, 'weapon1');
    player.gunSprite.setVisible(false);

    // Set the player's collider
    player.collider = new Phaser.Geom.Circle(player.x, player.y, player.width / 2);

    return player;
}

var stopped = false;
var jumping = false;
var doubleJumping = false;
var timer = 0;
var doubleJumpTimer = 10;
var spaceUp = true;
var falling = false;


export function handlePlayerMovementInside(scene, player, shootControl, shootCooldown) {
    const aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const kKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const speed = 200;
    const jumpStrength = 300;

    const leftMouseButton = scene.input.activePointer.leftButtonDown();


    if (leftMouseButton){
        const crosshairX = scene.input.mousePointer.x + scene.cameras.main.worldView.x
        const crosshairY = scene.input.mousePointer.y + scene.cameras.main.worldView.y

        player.angle = Phaser.Math.Angle.Between(player.sprite.x, player.sprite.y, crosshairX, crosshairY);
    }

    // Handles shooting
    if (leftMouseButton && shootControl.canShoot) {
        let bullet = createBulletInside(scene, player, 20, 20, player.angle);
            scene.sound.play('weaponFireSound')

        scene.bullets.push(bullet); // Create a bullet when K is pressed
        shootControl.canShoot = false;
        setTimeout(() => {shootControl.canShoot = true;}, shootCooldown);
        scene.player.shoot = true;
    }
    else{
        if (shootControl.canShoot)
            scene.player.shoot = false;
    }


    // Move left
    if (aKey.isDown) {
        player.sprite.setVelocityX(-speed);
        
        // Only updates the direction if the dKey hasn't been pressed
        if (!dKey.isDown)
        player.facing = 'left'; // Update facing direction
    }

    // Move right
    if (dKey.isDown){
        player.sprite.setVelocityX(speed);

        // Only updates the direction if the aKey hasn't been pressed
        if (!aKey.isDown)
            player.facing = 'right'; // Update facing direction
    }

    // Not Moving
    if (!aKey.isDown && !dKey.isDown){
        player.sprite.setVelocityX(0);
    }

    // Checking to see if player is walking in general
    if (aKey.isDown || dKey.isDown){
        player.walking = true;
    }
    else{
        player.walking = false;
    }


    // JUMPING: 

    // Checks if player's velocity = 0 (stopped falling or not)
    if (player.sprite.body.velocity.y == 0){
        stopped = true;
        player.jumping = false;
    }
    else{
        stopped = false;
        player.jumping = true;
    }

    // Main Jump check only runs if the player's velocity is 0 and they aren't already jumping
    if (spaceKey.isDown && stopped && !jumping){
        player.sprite.setVelocityY(-jumpStrength);
        jumping = true;
        falling = false;
        timer = 0;
        spaceUp = false;

        player.jumping = true;
    }

    // increments timer for the double jump
    timer += 1;

    // Checks if space has been let go before a double jump
    if (!spaceKey.isDown){
        spaceUp = true;
    }

    // Checks if already jumping
    if (jumping){
        if (timer > doubleJumpTimer){ // Allows double jump if timer is ready and space has been let go from inital jump
            if (spaceUp && spaceKey.isDown && !doubleJumping){// Double Jump
                player.sprite.setVelocityY(-jumpStrength);
                doubleJumping = true;
                player.doubleJumping = true;

                falling = false;
            }
        }

        // Checks to see if player is falling from their jump
        if (player.sprite.body.velocity.y > 0){ // falling
            falling = true;
        }

        // Checks for when player hits the ground after falling from a jump
        if (falling){
            if (player.sprite.body.velocity.y == 0){ // hit ground
                jumping = false;
                doubleJumping = false;
                player.doubleJumping = false;
                falling = false;

                player.jumping = false;
            }
        }
    }
}

export function handlePlayerDamage(player, amount, scene) {
    player.health -= amount; // Deduct the amount of damage taken
    
    // Calculate the health bar scale based on the current health
    const maxHealth = 3; // max is 3 for now
    const healthPercentage = player.health / maxHealth;

    // Update the health bar scale
    player.healthBar.setScale(2 * healthPercentage, 2); // scaleX is now based on health
    
    // Align the left side of the health bar with the left side of the container after scaling
    // This assumes the container's origin is (0, 0.5) and it does not change
    const containerLeftEdge = player.healthContainer.x - (player.healthContainer.width * player.healthContainer.scaleX * 0.5);
    player.healthBar.x = containerLeftEdge + (player.healthBar.width * player.healthBar.scaleX * 0.5);

    if (player.health <= 0) {
        player.health = 0; 
        console.log("Game Over! Player has died.");
        // Call functions to handle the game over scenario
        scene.scene.pause();
        scene.scene.stop();
        scene.scene.launch('GameOverScene');
    }
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