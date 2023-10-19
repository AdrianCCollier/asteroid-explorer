import {
  createPlayerInside,
  loadPlayerImage,
  handlePlayerMovementInside,
  animationCreator
} from './player.js'
import {
  createEnemyInside,
  loadEnemyImage,
  handleEnemyMovementInside,
  handleEnemyMovement,
} from './enemy.js'
import { createWeaponInside, loadWeaponImage } from './weapons.js'
import {
  createBullet,
  handleBulletMovements,
  loadBulletImage,
} from './bullet.js'
import { createDoor, loadDoorImage } from './door.js'
import {
  addColliderWithWorld,
  addColliderWithGround,
  addObjectToWorld,
} from './collisions.js'
import GameOverScene from './gameOverScene.js'

import { createPlayerWalk, updatePlayerWalk } from './animation.js'

import Phaser from 'phaser'
import tileSet from './assets/nightsky.png'
import mapJSON from './assets/map.json'

// import background
import galaxyBackground from './assets/spaceBackground1.png'

// import new weapon
import M16 from './assets/weapons/M16.png'

var animations = []

let isWalkingForward = false;
let isWalkingBackward = false;
let isJumping = false;

export default class SidescrollerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SidescrollerScene' }) // Assigning key to this Scene
    this.player = null // Initialize player
    this.bullets = [] // Initialize bullets array
    this.enemies = [] // Initialize enemies array
    this.waveCount = 0 // Initialize wave counter
    this.maxWaves = 5 // Maximum number of enemy waves
  }

  preload() {
    // Pre-loading necessary assets for the scene
    loadPlayerImage(this)
    loadEnemyImage(this)
    loadWeaponImage(this)
    loadBulletImage(this)
    this.load.image('tiles', tileSet)
    this.load.tilemapTiledJSON('map', mapJSON)
    this.load.image('galaxy', galaxyBackground)
    this.load.image('M16', M16)
  }

  create() {
    // add background
    this.add.image(960, 540, 'galaxy').setScrollFactor(0)

    this.checkCollision = false // Initialize collision check
    // Setting a delayed timer to enable collision check
    this.time.delayedCall(
      1000,
      () => {
        this.checkCollision = true
      },
      [],
      this
    )

    // Create map
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('tiles1', 'tiles')
    this.layer = map.createLayer('surface', tileset, 0, 0);

    // Player creation and setup
    this.player = createPlayerInside(this, 100, 450)
    // Making sprite invisible so animation can play
    this.player.sprite.alpha = 0;
    addObjectToWorld(this, this.player.sprite)
    addColliderWithWorld(this, this.player.sprite)
    addColliderWithGround(this, this.player.sprite, this.ground)

    // Allow player to collide with Tiled layer
    this.physics.add.collider(this.player.sprite, this.layer)
    this.layer.setCollisionBetween(130, 190)

    // Camera setup
    this.cameras.main.startFollow(this.player.sprite)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    this.player.sprite.setCollideWorldBounds(false)

    // Weapon creation and setup
    this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    this.shootControl = { canShoot: true } // Initialize shooting control
    this.shootCooldown = 500 // Time in ms between allowed shots

    this.m16 = this.physics.add.sprite(300, 300, 'M16')
    this.m16.setScale(0.1)
    this.m16.setCollideWorldBounds(true)

    // Setup input controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // Enemy spawn timer
    // this.time.addEvent({
    //     delay: 2000,
    //     callback: this.spawnWave,
    //     callbackScope: this,
    //     repeat: this.maxWaves - 1,
    // });

    
    















    // Create the animations
  this.anims.create({
    key: "player_walk",
    frames: this.anims.generateFrameNumbers("walk"),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "player_idle",
    frames: this.anims.generateFrameNumbers("idle"),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "player_jump",
    frames: this.anims.generateFrameNumbers("jump"),
    frameRate: 16,
    repeat: -1,
  });



  this.walk = this.add.sprite(this.player.sprite.x, this.player.sprite.y, "walk");
  this.idle = this.add.sprite(this.player.sprite.x, this.player.sprite.y, "idle");
  this.jump = this.add.sprite(this.player.sprite.x, this.player.sprite.y, "jump");

  }

  update() {
    // Check keyboard input for "D" and "A" keys
  const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  const aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Set animation flags based on key presses
  isWalkingForward = dKey.isDown;
  isWalkingBackward = aKey.isDown;
  isJumping = spaceKey.isDown;

  // Set sprite positions
  this.walk.x = this.player.sprite.x;
  this.walk.y = this.player.sprite.y;

  this.idle.x = this.player.sprite.x;
  this.idle.y = this.player.sprite.y;

  this.jump.x = this.player.sprite.x;
  this.jump.y = this.player.sprite.y;

  // Play the appropriate animation
  if (isJumping){
    this.jump.anims.play("player_jump", true);
    this.walk.alpha = 0;
    this.idle.alpha = 0;
    this.jump.alpha = 1;

    if (isWalkingForward){
      this.jump.setFlipX(false); // Reset sprite orientation (walk forward)
    }
    else if (isWalkingBackward){
      this.jump.setFlipX(true); // Reset sprite orientation (walk forward)
    }
  }
  else if (isWalkingForward && isWalkingBackward) {
    this.idle.anims.play("player_idle", true);
    this.walk.anims.stop();
    this.walk.alpha = 0;
    this.idle.alpha = 1;
    this.jump.alpha = 0;
  } else if (isWalkingForward) {
    this.walk.anims.play("player_walk", true);

    this.walk.setFlipX(false); // Reset sprite orientation (walk forward)
    this.idle.setFlipX(false); // Reset sprite orientation (walk forward)
    this.jump.setFlipX(false); // Reset sprite orientation (walk forward)

    this.walk.alpha = 1;
    this.idle.alpha = 0;
    this.jump.alpha = 0;
  } else if (isWalkingBackward) {
    this.walk.anims.play("player_walk", true);

    this.walk.setFlipX(true); // Flip sprite horizontally (walk backward)
    this.idle.setFlipX(true); // Flip sprite horizontally (walk backward)
    this.jump.setFlipX(true); // Flip sprite horizontally (walk backward)

    this.walk.alpha = 1;
    this.idle.alpha = 0;
    this.jump.alpha = 0;
  } else {
    // If neither key is pressed, play the idle animation
    this.idle.anims.play("player_idle", true);
    this.walk.anims.stop();
    this.walk.alpha = 0;
    this.idle.alpha = 1;
    this.jump.alpha = 0;
  }
    
    // Handling Player and Enemy movements and interactions every frame
    handlePlayerMovementInside(
      this,
      this.player,
      this.shootControl,
      this.shootCooldown
    )
    this.enemies.forEach((enemy) =>
      handleEnemyMovementInside(this, this.bullets, enemy)
    )
    handleBulletMovements(this.bullets)

    // Check for weapon pickup
    if (
      this.weapon &&
      this.weapon.sprite &&
      this.player &&
      this.player.sprite &&
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.sprite.getBounds(),
        this.weapon.sprite.getBounds()
      )
    ) {
      // Weapon picked up
      this.weapon.sprite.setVisible(false)
      this.player.gunSprite.setVisible(true)
      this.player.hasWeapon = true
      this.player.canShoot = true
    }

    // Adjust gun sprite position and rotation to match the player
    if (this.player.hasWeapon) {
      this.player.gunSprite.x = this.player.sprite.x
      this.player.gunSprite.y = this.player.sprite.y
      this.player.gunSprite.rotation = this.player.sprite.rotation
    }

    // Check all enemies' status and show congratulation screen if conditions met
    if (this.checkAllEnemiesDeadTimer && this.areAllEnemiesDead()) {
      this.showCongratulationScreen()
    }

    // Checks for enemy collision with player
    // Iterate over each enemy
    this.enemies.forEach((enemy) => {
      if (enemy && enemy.sprite) {
        // Check if the bullet intersects with the enemy and destroy the enemy if true
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            enemy.sprite.getBounds(),
            this.player.sprite.getBounds()
          )
        ) {
          if (!enemy.destroyed) {
            // empties enemies array
            this.enemies = []
            this.waveCount = 0 // Initialize wave counter
            this.maxWaves = 5 // Maximum number of enemy waves
            this.scene.pause() // Pause the current scene
            this.scene.stop() // Stops current scene
            this.scene.launch('GameOverScene') // Launch the ConfirmationScene
          }
        }
      }
    })
  }
  // Spawn enemies in waves until the maximum number of waves is reached
  // Also checks for all enemies dead after all waves are spawned
  spawnWave() {
    if (this.waveCount < this.maxWaves) {
      for (let i = 0; i < 5; i++) {
        this.time.addEvent({
          delay: i * 500,
          callback: () => {
            let enemy = createEnemyInside(this, 800, 568 - 100 - 10)
            this.enemies.push(enemy)
            addObjectToWorld(this, enemy.sprite)
            addColliderWithWorld(this, enemy.sprite)
            addColliderWithGround(this, enemy.sprite, this.ground)
            this.physics.add.collider(enemy.sprite, this.layer)
          },
          callbackScope: this,
        })
      }
      this.waveCount++

      if (this.waveCount === this.maxWaves) {
        this.time.delayedCall(5000, () => {
          this.checkAllEnemiesDeadTimer = this.time.addEvent({
            delay: 2000,
            callback: this.checkAllEnemiesDead,
            callbackScope: this,
            loop: true,
          })
        })
      }
    }
  }

  // Return true if all enemies are dead or inactive
  areAllEnemiesDead() {
    return this.enemies.every((enemy) => !enemy.sprite.active)
  }

  // If all enemies are dead, show congratulation screen and remove the check timer
  checkAllEnemiesDead() {
    if (this.areAllEnemiesDead()) {
      this.showCongratulationScreen()
      if (this.checkAllEnemiesDeadTimer) this.checkAllEnemiesDeadTimer.remove()
    }
  }

  // Displays congratulation message and restarts the level when 'R' is pressed
  showCongratulationScreen() {
    if (this.congratsText) return

    this.congratsText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Congratulations! \n Press R to Head back to Orbit!',
        { fontSize: '32px', color: '#fff' }
      )
      .setOrigin(0.5, 0.5)

    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

    this.keyR.once('down', () => {
      this.congratsText.destroy()
      window.location.href = '/' // Change the URL to '/'
    })
  }
}
