import {
  createPlayerInside,
  loadPlayerImage,
  handlePlayerMovementInside,
  animationCreator,
  loadWeaponSounds
} from './player.js'
import {
  createEnemiesGroup,
  createEnemyInside,
  handleEnemyMovementInside,
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


import { 
  loadPlayerAnimations,
  createPlayerAnimations, 
  updatePlayerAnimations, 
  loadEnemyAnimations,
  createEnemyAnimations
} from './animation.js'

import Phaser from 'phaser'
// import tileSet from './assets/nightsky.png'
// import mapJSON from './assets/map.json'
import tileSet from './assets/spritesheet.png'
import mapJSON from './assets/map1.json'

// import background
import galaxyBackground from './assets/spaceBackground1.png'

// import new weapon
import M16 from './assets/weapons/M16.png'

import { loadHealthBar, loadShieldBar, updateBars } from './health'

export default class SidescrollerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SidescrollerScene' }) // Assigning key to this Scene
    this.player = null // Initialize player
    this.bullets = [] // Initialize bullets array
    this.map = null;

    this.spawnPoints = [
      { x: 425, y: 300 },
      { x: 500, y: 400 },
      { x: 600, y: 400 },
      { x: 800, y: 400 },
      { x: 900, y: 400 },
      { x: 1000, y: 400 },
    ]
  }

  preload() {
    // Pre-loading necessary assets for the scene
    loadPlayerImage(this)
    loadPlayerAnimations(this)
    loadEnemyAnimations(this)
    loadWeaponSounds(this)
    loadWeaponImage(this)
    loadBulletImage(this)
    this.load.image('tiles', tileSet)
    this.load.tilemapTiledJSON('map', mapJSON)
    this.load.image('galaxy', galaxyBackground)
    this.load.image('M16', M16)
    loadHealthBar(this);
    loadShieldBar(this);
  }

  

  create() {
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

    // add background
    this.add.image(960, 540, 'galaxy').setScrollFactor(0.15)
    
    this.enemies = createEnemiesGroup(this)

    this.spawnPoints.forEach((spawn) => {
      createEnemyInside(this, this.enemies, spawn.x, spawn.y)
    })

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
    const tileset = this.map.addTilesetImage('spritesheet', 'tiles')
    this.layer = this.map.createLayer('Tile Layer 1', tileset, 0, 0)

    // Player creation and setup
    this.player = createPlayerInside(this, 100, 250)

    // Customize dimensions of player hitbox, seen with debug mode enabled
    this.player.sprite.body.setSize(25, 63)

    //this.physics.add.collider(this.player, collisionObjects)

    // Allow player to collide with Tiled layer
    //this.physics.add.collider(this.player.sprite, this.layer)
    //this.layer.setCollisionBetween(130, 190)
    this.layer.setCollisionBetween(5, 35)
    this.layer.setCollision(1)
    this.layer.setCollision(3)
    
    this.physics.add.collider(
      this.player.sprite,
      this.layer,
      this.handleTileCollision,
      null,
      this
    )
    this.physics.add.collider(this.enemies, this.layer)

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

    // allow player to fall off the map
    this.player.sprite.setCollideWorldBounds(false)

    // this.physics.world.createDebugGraphic()

    // Weapon creation and setup
    loadWeaponSounds(this)

    this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    // fix shooting straight away
    this.shootControl = { canShoot: true } // Initialize shooting control
    this.shootCooldown = 400 // Time in ms between allowed shots

    this.m16 = this.physics.add.sprite(900, 300, 'M16')
    this.m16.setScale(0.09)
    this.m16.setGravityY(0)
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

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnAliens,
      callbackScope: this,
    })

    // testing, display level message
    // Add a text message to the top-center of the game view
    this.add
      .text(this.cameras.main.centerX, 50, 'Level 0', {
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

    // Making sprite invisible so animation can play
    this.player.sprite.alpha = 0

    // Creates animations for given scene
    createPlayerAnimations(this, this.player)

    // Creates enemy animations for given scene
    createEnemyAnimations(this, this.player)

  } // end create function

  update() {
    // if the player falls off the map, end the game
    if (this.player.sprite.y > this.map.heightInPixels) {

      // reset variables before restarting game to avoid undefined properties error
      this.bullets = [] 
      this.scene.pause()
      this.scene.stop()
      this.scene.launch('GameOverScene')
    }
    this.enemies.getChildren().forEach(enemy => {
      handleEnemyMovementInside(this, this.bullets, enemy);
    });


    if (this.enemies.getLength() <= 1){
      this.showCongratulationScreen()
    }


    updatePlayerAnimations(this);

    updateBars(this);


    // Handling Player and Enemy movements and interactions every frame
    handlePlayerMovementInside(
      this,
      this.player,
      this.shootControl,
      this.shootCooldown
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
  }

  // helpers

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

  handleTileCollision(player, tile) {
    if (tile.index === 3) {
      // 
      this.bullets = []; 
      this.scene.pause();
      this.scene.stop();
      this.scene.launch('GameOverScene');
    }
    if (tile.index === 1) { // 
      this.map.putTileAt(-1, tile.x, tile.y);
      
    }
  }
}