import Phaser from 'phaser'

import {
  createPlayerInside,
  loadPlayerImage,
  handlePlayerMovementInside,
  animationCreator,
  loadWeaponSounds,
  handlePlayerDamage,
  asteroidFloor,
  alienFloor,
  platformFloor,
} from './player.js'

import {
  createEnemiesGroup,
  createFlyingEnemiesGroup,
  createBossGroup,
  createEnemyInside,
  handleEnemyMovementInside,
  createFlyingEnemy,
  handleFlyingEnemyMovement,
  createBoss,
  handleBossMovement,
  scaleEnemyAttributes,
} from './enemy.js'

import { createWeaponInside, loadWeaponImage, unlockWeapon } from './weapons.js'

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


import {
  loadPlayerAnimations,
  createPlayerAnimations,
  updatePlayerAnimations,
  loadEnemyAnimations,
  createEnemyAnimations,
} from './animation.js'

import mapTileSet from './assets/Maps/tilesets/asteroid_floors_extruded.png'
import mapsJSON from './assets/Maps/Ryugu.json'
import wallMapJSON from './assets/Maps/Ryugu_Walls.json'

// import background
import galaxyBackground from './assets/spaceBackground1.png'

// Import Ryugu dialogue
import ryuguDialogue from './assets/sounds/Static_Ryugu_Intro.mp3'

// Import Score System
import ScoreSystem from './ScoreSystem.js'

import { loadHealthBar, loadShieldBar, updateBars } from './health'

const walls = 'assets/tilesets/walls_lights_extruded.png'

export default class Ryugu extends Phaser.Scene {
  constructor() {
    super({ key: 'Ryugu' }) // Assigning key to this Scene
    this.player = null // Initialize player
    this.bullets = [] // Initialize bullets array
    this.map = null
  }

  preload() {
    // Pre-loading necessary assets for the scene
    loadPlayerImage(this)
    loadPlayerAnimations(this)
    loadEnemyAnimations(this)
    loadWeaponSounds(this)
    loadWeaponImage(this)
    loadBulletImage(this)

    this.load.image('tiles', mapTileSet)

    this.load.image('wallTiles', walls)

    this.load.tilemapTiledJSON('map', mapsJSON)
    this.load.tilemapTiledJSON('wallMap', wallMapJSON)

    this.load.image('galaxy', 'assets/Background.jpg')
    this.load.audio('ryuguDialogue', ryuguDialogue)

    loadHealthBar(this)
  }

  create() {
    this.physics.world.gravity.y = 9.8 * 0.0011 * 20000; // Adjusted gravity

    // Handle canvas resizing on window resize
    const canvas = this.game.canvas
    function resizeCanvas() {
      canvas.id =
        window.innerHeight > window.innerWidth
          ? 'phaser-canvas-tall'
          : 'phaser-canvas-wide'
    }
    resizeCanvas() // Initial resizing
    window.addEventListener('resize', resizeCanvas) // Add event listener for window resize

    // Play dialogue when level starts
    // this.ryuguDialogue = this.sound.add('ryuguDialogue')
    // this.ryuguDialogue.play()

    this.ryuguDialogue = this.sound.add('ryuguDialogue')

    // Check if the player has visited the Ryugu level before
    // Play the dialogue only the first time
    if (localStorage.getItem('RyuguVisited') !== 'true') {
      this.ryuguDialogue.setVolume(0.4);
      this.ryuguDialogue.play()
      localStorage.setItem('RyuguVisited', 'true')
    }

    // create new Score
    this.scoreManager = new ScoreSystem(this)

    // Inventory Logic Feature Testing
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.launch('PauseScene', { gameScene: this })
    })

    // add background
    this.add.image(960, 540, 'galaxy').setScrollFactor(0.15)

    this.enemies = createEnemiesGroup(this)
    this.flyingEnemies = createFlyingEnemiesGroup(this)
    this.boss = createBossGroup(this)

    this.enemySleepAnimators = []

    createBoss(this, this.boss, 1315, 2200)
    this.checkCollision = false // Initialize collision check

    // Setting a delayed timer to enable collision check
    this.time.delayedCall(
      500,
      () => {
        this.checkCollision = true
      },
      [],
      this
    )

    // Create map
    this.map = this.make.tilemap({ key: 'map' })

    const tileset = this.map.addTilesetImage(
      'Floor_Tiles',
      'tiles',
      32,
      32,
      1,
      2
    )
    const wallTileSet = this.map.addTilesetImage(
      'Wall_Tiles',
      'wallTiles',
      32,
      32,
      1,
      2
    )

    this.wallLayer = this.map.createLayer('Walls', wallTileSet, 0, 0)
    this.lightLayer = this.map.createLayer('Lights', wallTileSet, 0, 0)
    this.asteroidLayer = this.map.createLayer('Floors', tileset, 0, 0)
    this.alienLayer = this.map.createLayer('Alien Floors', tileset, 0, 0)
    this.platformLayer = this.map.createLayer('Platforms', tileset, 0, 0)

    this.asteroidLayer.setCollisionByProperty({ collides: true })
    this.alienLayer.setCollisionByProperty({ collides: true })
    this.platformLayer.setCollisionByProperty({ collides: true })

    // Adds colliders between enemies and layers
    this.physics.add.collider(this.enemies, this.asteroidLayer)
    this.physics.add.collider(this.enemies, this.alienLayer)
    this.physics.add.collider(this.enemies, this.platformLayer)
    this.physics.add.collider(this.flyingEnemies, this.asteroidLayer)
    this.physics.add.collider(this.flyingEnemies, this.alienLayer)
    this.physics.add.collider(this.boss, this.asteroidLayer)
    this.physics.add.collider(this.boss, this.alienLayer)

    this.spawnLayer = this.map.createLayer('Spawns', tileset, 0, 0)

    this.spawnWalkingEnemies = []
    this.spawnFlyingEnemies = []

    this.spawnLayer.forEachTile(function (tile) {
      if (tile.properties.spawn == true) {
        var spawnRandom = Math.random()

        var x = tile.pixelX + 32 / 2
        var y = tile.pixelY + 32

        if (spawnRandom < 0.5) this.spawnWalkingEnemies.push({ x, y })
        else this.spawnFlyingEnemies.push({ x, y })
      }
    }, this)

    this.spawnWalkingEnemies.forEach((spawn) => {
      createEnemyInside(this, this.enemies, spawn.x, spawn.y)
    })
    this.spawnFlyingEnemies.forEach((spawn) => {
      createFlyingEnemy(this, this.flyingEnemies, spawn.x, spawn.y)
    })

    scaleEnemyAttributes(this.enemies, this.flyingEnemies, this.boss)

    // expand world bounds to entire map not just the camera view
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    )

    // Weapon creation and setup
    loadWeaponSounds(this)

    this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    // fix shooting straight away
    this.shootControl = { canShoot: true } // Initialize shooting control

    if (localStorage.getItem('equipped') == '"pistol"') {
      this.shootCooldown = 800 // Time in ms between allowed shots
      if (
        localStorage.getItem('pistolLevel') == 2 ||
        localStorage.getItem('pistolLevel') == 3
      ) {
        this.shootCooldown = 500 // level 2 rate of fire
      }
      if (
        localStorage.getItem('pistolLevel') == 4 ||
        localStorage.getItem('pistolLevel') == 5
      ) {
        this.shootCooldown = 300 // level 2 rate of fire
      }
      if (localStorage.getItem('pistolLevel') >= 6) {
        this.shootCooldown = 100 // level 2 rate of fire
      }
    } else if (localStorage.getItem('equipped') == '"ar"') {
      this.shootCooldown = 250 // Time in ms between allowed shots
      if (
        localStorage.getItem('arLevel') == 2 ||
        localStorage.getItem('arLevel') == 3
      ) {
        this.shootCooldown = 200 // level 2 rate of fire
      }
      if (
        localStorage.getItem('arLevel') == 4 ||
        localStorage.getItem('arLevel') == 5
      ) {
        this.shootCooldown = 100 // level 4 rate of fire
      }
      if (localStorage.getItem('arLevel') >= 6) {
        this.shootCooldown = 75 // highest fire rate without glitch
      }
    } else if (localStorage.getItem('equipped') == '"shotgun"') {
      this.shootCooldown = 600 // Time in ms between allowed shots
    } else {
      localStorage.setItem('equipped', JSON.stringify('pistol'))
      this.shootCooldown = 800 // Time in ms between allowed shots
    }

    // Setup input controls
    this.cursors = this.input.keyboard.createCursorKeys()

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnAliens,
      callbackScope: this,
    })

    // testing, display level message
    // Add a text message to the top-center of the game view
    this.add
      .text(this.cameras.main.centerX, 50, '', {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5,
        },
      })
      .setOrigin(0.5, 0.5) // this will center the text based on its coordinates

    // Create weapon pick up message, be invisible by default
    this.pickupText = this.add.text(300, 100, 'Press E To Pick Up', {
      fontSize: '24px',
      fill: '#FFF',
    })
    this.pickupText.setVisible(false)

    this.player = createPlayerInside(this, 109, 3520)

    this.player.chaseCount = 0;
    this.player.bossChase = false;

    this.playerCoordsText = this.add
      .text(16, 100, '', { fontSize: '18px', fill: '#FF0000' })
      .setScrollFactor(0)

    // Customize dimensions of player hitbox, seen with debug mode enabled
    this.player.sprite.body.setSize(25, 63)

    // Applies Map layer collisions to player
    this.physics.add.collider(
      this.player.sprite,
      this.alienLayer,
      alienFloor,
      null,
      this
    )
    this.physics.add.collider(
      this.player.sprite,
      this.platformLayer,
      alienFloor,
      null,
      this
    )
    this.physics.add.collider(
      this.player.sprite,
      this.asteroidLayer,
      platformFloor,
      null,
      this
    )

    // Add collider between the player and the enemies
    this.physics.add.collider(
      this.player.sprite,
      this.enemies,
      handlePlayerEnemyCollision,
      null,
      this
    )
    this.physics.add.collider(
      this.player.sprite,
      this.flyingEnemies,
      handlePlayerEnemyCollision,
      null,
      this
    )
    this.physics.add.collider(
      this.player.sprite,
      this.boss,
      handlePlayerEnemyCollision,
      null,
      this
    )

    // Set up camera to follow player
    this.cameras.main.startFollow(this.player.sprite)

    this.game.canvas.style.cursor = 'crosshair'

    // Set the bounds of the camera to stay within our Tiled map
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    )

    // allow player to fall off the map
    this.player.sprite.setCollideWorldBounds(true)

   

    // Making sprite invisible so animation can play
    this.player.sprite.alpha = 0

    // Creates animations for given scene
    createPlayerAnimations(this, this.player)

    // Creates enemy animations for given scene
    createEnemyAnimations(this, this.player)
  } // end create function

  update() {
    if (this.player.chaseCount < 0){
      this.player.chaseCount = 0;
    }


    // if the player falls off the map, end the game
    if (this.player.sprite.y > this.map.heightInPixels) {
      // reset variables before restarting game to avoid undefined properties error
      this.bullets = []
      this.scene.pause()
      this.scene.stop()
      this.scene.launch('GameOverScene')
    }
    this.enemies.getChildren().forEach((enemy) => {
      handleEnemyMovementInside(this, enemy)
      enemy.setDepth(2) // Ensure enemies are above walls
    })
    this.flyingEnemies.getChildren().forEach((enemy) => {
      handleFlyingEnemyMovement(this, enemy)
      enemy.setDepth(2) // Ensure enemies are above walls
    })
    this.boss.getChildren().forEach((enemy) => {
      handleBossMovement(this, enemy)
      enemy.setDepth(2) // Ensure enemies are above walls
    })

    this.enemySleepAnimators.forEach((enemy) => {
      if (enemy.type == 'tall') {
        // sleep animation for tall alien
        if (
          !enemy.animator.anims.isPlaying &&
          enemy.animator.body.velocity.y == 0
        )
          enemy.animator.anims.play('tall_alien_sleep', true)
      } else if (enemy.type == 'flying') {
        // sleep animation for flying alien
        if (
          !enemy.animator.anims.isPlaying &&
          enemy.animator.body.velocity.y == 0
        )
          enemy.animator.anims.play('flying_alien_sleep', true)
      } else if (enemy.type == 'boss') {
        if (!enemy.animator.anims.isPlaying) {
          var s = parseInt(localStorage.getItem('bossKills'))
          s += 1
          localStorage.setItem('bossKills', JSON.stringify(s))
          console.log(s)

          if (s == 1) {
            localStorage.setItem('shotgun', JSON.stringify(true))
            localStorage.setItem('equipped', JSON.stringify('shotgun'))
          } else if (s == 2) {
            localStorage.setItem('ar', JSON.stringify(true))
            localStorage.setItem('equipped', JSON.stringify('ar'))
          }

          // Call functions to handle the game over scenario
          this.scene.pause()
          this.scene.stop()
          this.scene.launch('WinScene')
        }
      }
    })

    if (this.enemies.getLength() <= -1) {
      //this.showCongratulationScreen()
      this.scene.pause()
      this.scene.stop()
      this.scene.launch('WinScene')
    }

    updatePlayerAnimations(this)

    updateBars(this)

    // Handling Player and Enemy movements and interactions every frame
    handlePlayerMovementInside(
      this,
      this.player,
      this.shootControl,
      this.shootCooldown
    )

    handleBulletMovements(
      this.bullets,
      this.enemies,
      this.flyingEnemies,
      this.boss,
      this
    )

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
      this.player.hasWeapon = false
      this.player.canShoot = false
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



    let distanceToWeapon = Phaser.Math.Distance.Between(
      this.player.sprite.x,
      this.player.sprite.y
    )

    if (distanceToWeapon < 50) {
      this.pickupText.setVisible(true)

      // pick up weapon
      if (this.cursors.pickup.isDown) {
        //dthis.equipWeapon()
      }
    } else {
      this.pickupText.setVisible(false)
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
      window.location.href = '/solarSystem' // Change the URL to '/'
    })
  }
}

function handlePlayerEnemyCollision(playerSprite, enemySprite) {
  if (!this.player.isInvulnerable) {
    // Handle player damage and invulnerability
    handlePlayerDamage(this.player, 1, this)
    this.player.isInvulnerable = true
    this.time.delayedCall(
      1500,
      () => {
        this.player.isInvulnerable = false
      },
      [],
      this
    )
  }
}
