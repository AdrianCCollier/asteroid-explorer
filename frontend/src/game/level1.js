// Import dependencies
import { createPlayer, loadPlayerImage, handlePlayerMovement } from './player.js';
import { createAsteroid } from './asteroid.js';
import { createEnemy, loadEnemyImage, handleEnemyMovement } from './enemy.js';
import { createWeapon, loadWeaponImage } from './weapons.js';
import { createBullet, handleBulletMovements, loadBulletImage } from './bullet.js';
import { createDoor, loadDoorImage } from './door.js';
import { addColliderBetweenObjects, addObjectToWorld } from './collisions.js';
import ConfirmationScene from './confirmationScene.js';

import Phaser from 'phaser';

import './game.css'


export default class Level1Scene extends Phaser.Scene {

  constructor() {
    super({ key: 'Level1Scene' }); // Define the key for this scene
    this.player = null; // Initialize player to null
    this.asteroid = null; // Initialize asteroid to null
    this.bullets = []; // Initialize an array to hold bullet objects
  }

  preload() {
    // Preload assets for the scene
    loadPlayerImage(this);
    loadEnemyImage(this);
    loadWeaponImage(this);
    loadBulletImage(this);
    loadDoorImage(this);
  }

  create() {
    this.checkCollision = false; // Flag to control the collision check
    // Set a delayed call to enable collision check after 1 second
    this.time.delayedCall(1000, () => { this.checkCollision = true; }, [], this);

    // Create the world, door, player, and enemy
    this.asteroid = createAsteroid(this, this.game, 121);
    this.door = createDoor(this, this.asteroid, 55, 64);
    this.player = createPlayer(this, this.asteroid, 64, 64);
    this.enemy = createEnemy(this, this.asteroid, 64, 64);

    // Set up the weapon configuration
    this.weapon = createWeapon(this, this.asteroid, 32, 32);
    this.shootControl = { canShoot: true }; // Control whether the player can shoot
    this.shootCooldown = 500; // Define the shooting cooldown time in milliseconds

    // Handle canvas resizing on window resize
    const canvas = this.game.canvas;
    function resizeCanvas() {
        canvas.id = window.innerHeight > window.innerWidth ? 'phaser-canvas-tall' : 'phaser-canvas-wide';
    }
    resizeCanvas(); // Initial resizing
    window.addEventListener('resize', resizeCanvas); // Add event listener for window resize
}

  update() {
    // Handle movements and actions on every frame update
    handlePlayerMovement(this, this.player, this.asteroid, this.shootControl, this.shootCooldown);
    handleEnemyMovement(this, this.bullets, this.enemy);
    handleBulletMovements(this.bullets);

    // Check for collision between player and weapon and allow the player to pick it up
    if (this.weapon && this.weapon.sprite && this.player && this.player.sprite &&
        Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), this.weapon.sprite.getBounds())) {
        this.weapon.sprite.setVisible(false); // Hide the weapon sprite
        this.player.gunSprite.setVisible(true); // Show the gun sprite
        this.player.hasWeapon = true; // Set flag indicating the player has a weapon
        this.player.canShoot = true; // Enable the player to shoot
    }

    // Update the weapon's position and rotation if the player has the weapon
    if (this.player.hasWeapon) {
      this.player.gunSprite.x = this.player.x;
      this.player.gunSprite.y = this.player.y;
      this.player.gunSprite.rotation = this.player.sprite.rotation;
    }

    // Check for collision between player and door, and launch the ConfirmationScene if they collide
    if (this.checkCollision && Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), this.door.sprite.getBounds())) {
      this.scene.pause(); // Pause the current scene
      this.scene.launch('ConfirmationScene'); // Launch the ConfirmationScene
    }
  }
}