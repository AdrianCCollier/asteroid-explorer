import {
  createPlayerInside,
  loadPlayerImage,
  handlePlayerMovementInside,
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

import Phaser from 'phaser'
import tileSet from './assets/nightsky.png'
import mapJSON from './assets/map.json'

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
  }

  create() {
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

    // Player creation and setup
    this.player = createPlayerInside(this, 100, 350)
    addObjectToWorld(this, this.player.sprite)
    addColliderWithWorld(this, this.player.sprite)
    addColliderWithGround(this, this.player.sprite, this.ground)

    // Create map
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('tiles1', 'tiles')
    const layer = map.createLayer('surface', tileset, 0, 0)

    // Allow player to collide with Tiled layer
    this.physics.add.collider(this.player.sprite, layer)
    layer.setCollisionBetween(148, 149)

    // Camera setup
    this.cameras.main.startFollow(this.player.sprite)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    this.player.sprite.setCollideWorldBounds(false)

    // Weapon creation and setup
    this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    this.shootControl = { canShoot: true } // Initialize shooting control
    this.shootCooldown = 500 // Time in ms between allowed shots

    // Setup input controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // Enemy spawn timer
    // this.time.addEvent({
    //     delay: 2000,
    //     callback: this.spawnWave,
    //     callbackScope: this,
    //     repeat: this.maxWaves - 1,
    // });
  }

  update() {
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
            let enemy = createEnemyInside(this, 800, 568 - 50 - 10)
            this.enemies.push(enemy)
            addObjectToWorld(this, enemy.sprite)
            addColliderWithWorld(this, enemy.sprite)
            addColliderWithGround(this, enemy.sprite, this.ground)
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
