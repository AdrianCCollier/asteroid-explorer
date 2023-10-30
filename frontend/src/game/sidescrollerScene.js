import {
  createPlayerInside,
  loadPlayerImage,
  initializePlayerControls,
  handlePlayerMovementInside,
  animationCreator,
  loadWeaponSounds
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

// import {
//   loadPlayerAnimations,
//   createPlayerAnimations,
//   updatePlayerAnimations,
//   loadEnemyAnimations,
//   createEnemyAnimations,
// } from './animation.js'

import Phaser from 'phaser'
import tileSet from './assets/nightsky.png'
import mapJSON from './assets/map.json'

// import background
import galaxyBackground from './assets/spaceBackground1.png'

// import new weapon
import M16 from './assets/weapons/M16.png'



var animations = []

let isWalkingForward = false
let isWalkingBackward = false
let isJumping = false

export default class SidescrollerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SidescrollerScene' }) // Assigning key to this Scene
    this.player = null // Initialize player
    this.bullets = [] // Initialize bullets array
    this.enemies = [] // Initialize enemies array
    this.waveCount = 0 // Initialize wave counter
    this.maxWaves = 5 // Maximum number of enemy waves
    this.map = null

    this.spawnPoints = [
      { x: 1000, y: 300 },
      { x: 2100, y: 0 },
      { x: 5000, y: 400 },
      { x: 6000, y: 400 },
      { x: 7000, y: 400 },
      { x: 8000, y: 400 },
      { x: 9000, y: 400 },
      { x: 10000, y: 400 },
    ]
  }

  preload() {
    // Pre-loading necessary assets for the scene
    loadPlayerImage(this)
    // loadPlayerAnimations(this)
    loadEnemyImage(this)
    // loadEnemyAnimations(this)
    loadWeaponImage(this)
    loadBulletImage(this)
    loadWeaponSounds(this)
    this.load.image('tiles', tileSet)
    this.load.tilemapTiledJSON('map', mapJSON)
    this.load.image('galaxy', galaxyBackground)
    // this.load.image('M16', M16)
    // this.load.audio('fireSound', fireSound);
  }

  create() {
    // add background
    this.add.image(960, 540, 'galaxy').setScrollFactor(0.15)

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

    // turned on for debugging mode
    this.physics.world.createDebugGraphic()

    // Player creation and setup
    this.player = createPlayerInside(this, 100, 250)

    // Customize dimensions of player hitbox, seen with debug mode enabled
    this.player.sprite.body.setSize(25, 63)

    // Create map using tileset with Tiled
    this.map = this.make.tilemap({ key: 'map' })
    const tileset = this.map.addTilesetImage('tiles1', 'tiles')

    // create surface layer, this is the visual asteroid rocky layer seen
    this.layer = this.map.createLayer('surface', tileset, 0, 0)

    // Initialize an static group for obstacles, set to static to make them immovable and meant to block player movement.
    this.obstaclesGroup = this.physics.add.staticGroup()

    // In Tiled, the object layer I created is called 'surfaceCollision' and Im referencing it here, it works correctly as the player can jump on the layer, but collision from the sides
    let obstacleObjects = this.map.getObjectLayer('surfaceCollision').objects
    obstacleObjects.forEach((obstacleObject) => {
      let obstacle = this.add.rectangle(
        obstacleObject.x + obstacleObject.width / 2,
        obstacleObject.y + 16,
        obstacleObject.width,
        obstacleObject.height
      )
      this.obstaclesGroup.add(obstacle)
    })

    // Allow player to collide with object layer squares
    this.physics.add.collider(
      this.player.sprite,
      this.obstaclesGroup,
      function () {
        console.log('Player collided with obstacle!')
      }
    )

    // Allow player to collide with tileset surface layer
    this.physics.add.collider(this.player.sprite, this.layer)
    this.layer.setCollisionBetween(130, 190)

    // expand world bounds to entire map not just the camera view
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    )

    // Set up camera to follow player
    this.cameras.main.startFollow(this.player.sprite)

    // Set the bounds of the camera to stay within our Tiled map
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    )

    // // Multi-directional firing
    // this.leftMouseClick = { isDown: false, justPressed: false }

    // // Set the listener for the left-click
    // this.input.on('pointerdown', function (pointer) {
    //   if (pointer.button === 0) {
    //     this.leftMouseClick.isDown = true
    //     this.leftMouseClick.justPressed = true
    //   }
    // })

    // // Reset the 'justPressed' state when the click is released
    // this.input.on('pointerup', function (pointer) {
    //   if (pointer.button === 0) {
    //     this.leftMouseClick.isDown = false
    //     this.leftMouseClick.justPressed = false
    //   }
    // })

    // this.input.on('pointerdown', function(pointer) {
    //   if(pointer.leftButtonDown()) {
    //     console.log('left mouse button clicked');

    //   }
    // })

    // initialize mouse control
    initializePlayerControls(this)

    loadWeaponSounds(this)

    // Weapon creation and setup
    this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    this.shootControl = { canShoot: true } // Initialize shooting control
    this.shootCooldown = 500 // Time in ms between allowed shots

    // this.m16 = this.physics.add.sprite(900, 300, 'M16')
    // this.m16.setScale(0.09)
    // this.m16.setGravityY(0)
    // this.physics.add.collider(this.m16, this.layer)

    // Setup input controls
    // this.cursors = this.input.keyboard.createCursorKeys()

    // // Add "E" key, add to its own function later
    // this.cursors.pickup = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.E
    // )

    // // Set up collider for weapon pickup
    // this.physics.add.collider(
    //   this.player.sprite,
    //   this.m16,
    //   this.pickUpWeapon,
    //   null,
    //   this
    // )

    // placeholder
    this.healthBar = createStaticHealthBar(this)

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnAliens,
      callbackScope: this,
    })

    // Create weapon pick up message, be invisible by default
    this.pickupText = this.add.text(300, 100, 'Press E To Pick Up', {
      fontSize: '24px',
      fill: '#FFF',
    })
    this.pickupText.setVisible(false)

    function createStaticHealthBar(scene) {
      // Create a new graphics object
      let healthBar = scene.add.graphics()

      // Set a fill style with a green color
      healthBar.fillStyle(0x00ff00, 1)

      // Draw a filled rectangle in the top-left corner of the screen
      // The rectangle will be 50 pixels wide and 5 pixels high, representing full health
      healthBar.fillRect(10, 10, 50, 5)

      healthBar.lineStyle(2, 0xffffff, 1) // white border with a width of 2
      healthBar.strokeRect(10, 10, 50, 5)

      return healthBar // return the healthBar so you can reference it elsewhere
    }

    // Making sprite invisible so animation can play
    // this.player.sprite.alpha = 0

    // // Creates animations for given scene
    // createPlayerAnimations(this, this.player)

    // // Creates enemy animations for given scene
    // createEnemyAnimations(this, this.player)
  } // end create function

  update() {
    // if the player falls off the map, end the game
    // reset variables before restarting game to avoid undefined properties error
    if (this.player.sprite.y > this.map.heightInPixels) {
      this.bullets = []
      this.enemies = []
      this.waveCount = 0
      this.maxWaves = 5
      this.scene.pause()
      this.scene.stop()
      this.scene.launch('GameOverScene')
    }

    // Update the health bar position to follow the player
    this.healthBar.x = this.player.sprite.x - 33 // Adjust the X-coordinate as needed
    this.healthBar.y = this.player.sprite.y - 70 // Adjust the Y-coordinate as needed

    // updatePlayerAnimations(this)

    // Set sprite positions
    /*


    this.idle.x = this.player.sprite.x
    this.idle.y = this.player.sprite.y

    this.jump.x = this.player.sprite.x
    this.jump.y = this.player.sprite.y

    // Play the appropriate animation
    if (isJumping) {
      this.jump.anims.play('player_jump', true)
      this.walk.alpha = 0
      this.idle.alpha = 0
      this.jump.alpha = 1

      if (isWalkingForward) {
        this.jump.setFlipX(false) // Reset sprite orientation (walk forward)
      } else if (isWalkingBackward) {
        this.jump.setFlipX(true) // Reset sprite orientation (walk forward)
      }
    } else if (isWalkingForward && isWalkingBackward) {
      this.idle.anims.play('player_idle', true)
      this.walk.anims.stop()
      this.walk.alpha = 0
      this.idle.alpha = 1
      this.jump.alpha = 0
    } else if (isWalkingForward) {
      this.walk.anims.play('player_walk', true)

      this.walk.setFlipX(false) // Reset sprite orientation (walk forward)
      this.idle.setFlipX(false) // Reset sprite orientation (walk forward)
      this.jump.setFlipX(false) // Reset sprite orientation (walk forward)

      this.walk.alpha = 1
      this.idle.alpha = 0
      this.jump.alpha = 0
    } else if (isWalkingBackward) {
      this.walk.anims.play('player_walk', true)

      this.walk.setFlipX(true) // Flip sprite horizontally (walk backward)
      this.idle.setFlipX(true) // Flip sprite horizontally (walk backward)
      this.jump.setFlipX(true) // Flip sprite horizontally (walk backward)

      this.walk.alpha = 1
      this.idle.alpha = 0
      this.jump.alpha = 0
    } else {
      // If neither key is pressed, play the idle animation
      this.idle.anims.play('player_idle', true)
      this.walk.anims.stop()
      this.walk.alpha = 0
      this.idle.alpha = 1
      this.jump.alpha = 0
    }*/

    // Handling Player and Enemy movements and interactions every frame
    handlePlayerMovementInside(
      this,
      this.player,
      this.shootControl,
      this.shootCooldown,
      this.leftMouseButtonDown
    )
    this.enemies.forEach((enemy) =>
      handleEnemyMovementInside(this, this.bullets, enemy)
    )

    handleBulletMovements(this.bullets)

    // weapon direction
    if (this.player.facing === 'left') {
      this.player.gunSprite.setTexture('weapon2') // set to the image key for the left-facing weapon
    } else {
      this.player.gunSprite.setTexture('weapon1') // set to the image key for the right-facing weapon
    }
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
    if (this.player.hasWeapon && this.player.facing === 'left') {
      this.player.gunSprite.x = this.player.sprite.x - 25
      this.player.gunSprite.y = this.player.sprite.y
      this.player.gunSprite.rotation = this.player.sprite.rotation
    }
    // Adjust gun sprite position and rotation to match the player
    if (this.player.hasWeapon && this.player.facing === 'right') {
      this.player.gunSprite.x = this.player.sprite.x + 25
      this.player.gunSprite.y = this.player.sprite.y
      this.player.gunSprite.rotation = this.player.sprite.rotation
    }

    // M16 weapon pickup logic

    // let distanceToWeapon = Phaser.Math.Distance.Between(
    //   this.player.sprite.x,
    //   this.player.sprite.y,
    //   this.m16.x,
    //   this.m16.y
    // )

    // if (distanceToWeapon < 50) {
    //   this.pickupText.setVisible(true)

    //   // pick up weapon
    //   if (this.cursors.pickup.isDown) {
    //     this.equipWeapon()
    //   }
    // } else {
    //   this.pickupText.setVisible(false)
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

  //spawn Aliens function, created to create individual aliens instead of waves
  spawnAliens() {
    this.spawnPoints.forEach((spawn) => {
      const enemy = createEnemyInside(this, spawn.x, spawn.y)
      this.enemies.push(enemy)
      this.physics.add.collider(enemy.sprite, this.layer)
      this.layer.setCollisionBetween(130, 190)
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
    this.pickupText.destroy()

    // Disable physics properties once equipped
    this.m16.setGravityY(0)
    this.m16.setVelocity(0, 0)
    this.m16.setImmovable(true)
    this.m16.body.allowGravity = false

    this.player.weapon = 'M16'
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
