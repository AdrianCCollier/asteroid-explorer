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

// import background
import galaxyBackground from './assets/spaceBackground1.png'

// import new weapon
import M16 from './assets/weapons/M16.png'
import gunPickupSound from './assets/sounds/gunPickup.mp3'

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
    this.load.audio('pickupSound', gunPickupSound)
  }

  create() {
    // add background
    this.add.image(960, 540, 'galaxy').setScrollFactor(0.1)

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
    this.layer = map.createLayer('surface', tileset, 0, 0)

    // Player creation and setup
    this.player = createPlayerInside(this, 100, 450)

    // Allow player to collide with Tiled layer
    this.physics.add.collider(this.player.sprite, this.layer)
    this.layer.setCollisionBetween(130, 190)

    // Camera setup
    this.cameras.main.startFollow(this.player.sprite)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    this.player.sprite.setCollideWorldBounds(false)

    // Weapon creation and setup
    // this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    this.shootControl = { canShoot: true } // Initialize shooting control
    this.shootCooldown = 500 // Time in ms between allowed shots

    this.m16 = this.physics.add.sprite(300, 300, 'M16')
    this.m16.setScale(0.09)
    this.m16.setGravityY(0)
    // this.m16.setCollideWorldBounds(true)
    this.physics.add.collider(this.m16, this.layer)

    // Setup input controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // Add "E" key, add to its own function later
    this.cursors.pickup = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    )

    // Set up collider for weapon pickup
    this.physics.add.collider(
      this.player.sprite,
      this.m16,
      this.pickUpWeapon,
      null,
      this
    )

    // Enemy spawn timer
    // this.time.addEvent({
    //     delay: 2000,
    //     callback: this.spawnWave,
    //     callbackScope: this,
    //     repeat: this.maxWaves - 1,
    // });

    // Create weapon pick up message, be invisible by default
    this.pickupText = this.add.text(300, 100, 'Press E To Pick Up', {
      fontSize: '24px',
      fill: '#FFF',
    })
    this.pickupText.setVisible(false)
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
    // if (
    //   this.weapon &&
    //   this.weapon.sprite &&
    //   this.player &&
    //   this.player.sprite &&
    //   Phaser.Geom.Intersects.RectangleToRectangle(
    //     this.player.sprite.getBounds(),
    //     this.weapon.sprite.getBounds()
    //   )
    // ) {
    //   // Weapon picked up
    //   this.weapon.sprite.setVisible(false)
    //   this.player.gunSprite.setVisible(true)
    //   this.player.hasWeapon = true
    //   this.player.canShoot = true
    // }

    let distanceToWeapon = Phaser.Math.Distance.Between(
      this.player.sprite.x,
      this.player.sprite.y,
      this.m16.x,
      this.m16.y
    )

    if (distanceToWeapon < 50) {
      this.pickupText.setVisible(true)

      // pick up weapon
      if (this.cursors.pickup.isDown) {
        this.equipWeapon()
      }
    } else {
      this.pickupText.setVisible(false)
    }

    // If player has the M16
    if (this.player.weapon === 'M16') {
      const offsetX = 30
      const offsetY = 10
      this.m16.setPosition(
        this.player.sprite.x + offsetX,
        this.player.sprite.y + offsetY
      )
    }

    // Adjust gun sprite position and rotation to match the player
    // if (this.player.hasWeapon) {
    //   this.player.gunSprite.x = this.player.sprite.x
    //   this.player.gunSprite.y = this.player.sprite.y
    //   this.player.gunSprite.rotation = this.player.sprite.rotation
    // }

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

  // Equip M16 weapon
  equipWeapon() {
    const offsetX = 40
    const offsetY = 0
    this.m16.setVisible(true)
    this.m16.setPosition(
      this.player.sprite.x + offsetX,
      this.player.sprite.y + offsetY
    )
    this.m16.setDepth(this.player.sprite.depth + 1)
    this.pickupText.destroy();

    // Disable physics properties once equipped
    this.m16.setGravityY(0)
    this.m16.setVelocity(0, 0)
    this.m16.setImmovable(true)
    this.m16.body.allowGravity = false

    this.player.weapon = 'M16'
    this.sound.play('pickupSound');
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
