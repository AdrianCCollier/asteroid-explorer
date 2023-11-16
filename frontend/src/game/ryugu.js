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
  platformFloor
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
  handleBossMovement
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
import GameOverScene from './gameOverScene.js'


import { 
  loadPlayerAnimations,
  createPlayerAnimations, 
  updatePlayerAnimations, 
  loadEnemyAnimations,
  createEnemyAnimations
} from './animation.js'



import mapTileSet from './assets/Maps/tilesets/asteroid_floors.png'
import wallMapTileSet from './assets/Maps/tilesets/asteroid_walls.png'
import mapsJSON from './assets/Maps/Ryugu.json'
import wallMapJSON from './assets/Maps/Ryugu_Walls.json'


// import background
import galaxyBackground from './assets/spaceBackground1.png'

// Import Ryugu dialogue
import ryuguDialogue from './assets/sounds/Ryugu.mp3'

// import new weapon
import M16 from './assets/weapons/M16.png'


import { loadHealthBar, loadShieldBar, updateBars } from './health'


export default class Ryugu extends Phaser.Scene {
  constructor() {
    super({ key: 'Ryugu' }) // Assigning key to this Scene
    this.player = null // Initialize player
    this.bullets = [] // Initialize bullets array
    this.map = null;

    this.spawnWalkingEnemies = [
      { x: 301, y: 3488 },
      { x: 711, y: 3390 },
      { x: 1111, y: 3328 },
      { x: 1790, y: 3680 },
      { x: 2100, y: 3680 },

    ]
    this.spawnFlyingEnemies = [
      { x: 455, y: 3232 },
      { x: 844, y: 3232 },
      { x: 1334, y: 3200 },
      { x: 1784, y: 3420},
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

    
    this.load.image('tiles', mapTileSet)
    this.load.image('wallTiles', wallMapTileSet)
    this.load.tilemapTiledJSON('map', mapsJSON)
    this.load.tilemapTiledJSON('wallMap', wallMapJSON)


    this.load.image('galaxy', galaxyBackground)
    this.load.audio('ryuguDialogue', ryuguDialogue);
    this.load.image('M16', M16)
    loadHealthBar(this);
    //loadShieldBar(this);

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

    // Play dialogue when level starts
    // this.ryuguDialogue = this.sound.add('ryuguDialogue')
    // this.ryuguDialogue.play()

     this.ryuguDialogue = this.sound.add('ryuguDialogue')

     // Check if the player has visited the Ryugu level before
     // Play the dialogue only the first time
     if (localStorage.getItem('RyuguVisited') !== 'true') {
       this.ryuguDialogue.play()
       localStorage.setItem('RyuguVisited', 'true')
     }

    // Inventory Logic Feature Testing
    this.input.keyboard.on('keydown-U', () => {
      unlockWeapon('rocketLauncher')
      console.log('unlockWeapon function called, from weapons.js')
    })
    
    // add background
    this.add.image(960, 540, 'galaxy').setScrollFactor(0.15)

    this.enemies = createEnemiesGroup(this)
    this.flyingEnemies = createFlyingEnemiesGroup(this);
    this.boss = createBossGroup(this);
    this.spawnWalkingEnemies.forEach((spawn) => {
      createEnemyInside(this, this.enemies, spawn.x, spawn.y)
    })
    this.spawnFlyingEnemies.forEach((spawn) => {
      createFlyingEnemy(this, this.flyingEnemies, spawn.x, spawn.y)
    })
    
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
      
      
      
      this.player = createPlayerInside(this, 109, 3520)
      this.playerCoordsText = this.add.text(16, 100, '', { fontSize: '18px', fill: '#FF0000' }).setScrollFactor(0);
      // Create wallMap
      this.wallMap = this.make.tilemap({ key: 'wallMap' })
      const wallTileSet = this.wallMap.addTilesetImage('Wall_Tiles', 'wallTiles');
      this.wallLayer = this.wallMap.createLayer('Walls', wallTileSet, 0, 0)
      this.lightLayer = this.wallMap.createLayer('Lights', wallTileSet, 0, 0)
      
      // Create map
      this.map = this.make.tilemap({ key: 'map' })
      const tileset = this.map.addTilesetImage('Floor_Tiles', 'tiles')
      
    this.asteroidLayer = this.map.createLayer('Floors', tileset, 0, 0);
    this.alienLayer = this.map.createLayer('Alien Floors', tileset, 0, 0);
    this.platformLayer = this.map.createLayer('Platforms', tileset, 0, 0);

    this.asteroidLayer.setCollisionByProperty({ collides: true })
    this.alienLayer.setCollisionByProperty({ collides: true })
    this.platformLayer.setCollisionByProperty({ collides: true })

    // Player creation and setup

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

    // Adds colliders between enemies and layers
    this.physics.add.collider(this.enemies, this.asteroidLayer)
    this.physics.add.collider(this.enemies, this.alienLayer)
    this.physics.add.collider(this.enemies, this.platformLayer)
    this.physics.add.collider(this.flyingEnemies, this.asteroidLayer)
    this.physics.add.collider(this.flyingEnemies, this.alienLayer)
    this.physics.add.collider(this.boss, this.asteroidLayer)
    this.physics.add.collider(this.boss, this.alienLayer)
    // this.physics.add.collider(this.flyingEnemies, this.platformLayer)
    
    // Add collider between the player and the enemies
    this.physics.add.collider(this.player.sprite, this.enemies, handlePlayerEnemyCollision, null, this);

    

    /*this.platformPositions.forEach(function (position) {
      // Access individual x and y values
      var x = position.x;
      var y = position.y;
  
      // Your logic here, for example, log the positions
      console.log("Tile at position - X: " + x + ", Y: " + y);
      }, this);*/

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
    this.player.sprite.setCollideWorldBounds(true)

    // this.physics.world.createDebugGraphic()

    // Weapon creation and setup
    loadWeaponSounds(this)

    this.weapon = createWeaponInside(this, 200, 470, 32, 32)
    // fix shooting straight away
    this.shootControl = { canShoot: true } // Initialize shooting control
    this.shootCooldown = 400 // Time in ms between allowed shots

    // Setup input controls
    this.cursors = this.input.keyboard.createCursorKeys()

    // Add "E" key, add to its own function later
    this.cursors.pickup = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    )

    // Set up collider for weapon pickup
    this.physics.add.collider(
      this.player.sprite,
      //this.m16,
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
      enemy.setDepth(2); // Ensure enemies are above walls

    });
    this.flyingEnemies.getChildren().forEach(enemy => {
      handleFlyingEnemyMovement(this, enemy);
        enemy.setDepth(2); // Ensure enemies are above walls
    });
    this.boss.getChildren().forEach(enemy => {
      handleBossMovement(this, enemy);
        enemy.setDepth(2); // Ensure enemies are above walls
    });
    this.playerCoordsText.setText(`Player X: ${this.player.sprite.x.toFixed(2)}, Y: ${this.player.sprite.y.toFixed(2)}`);

    if (this.enemies.getLength() <= -1){
      //this.showCongratulationScreen()
      this.scene.pause();
      this.scene.stop();
      this.scene.launch('WinScene')
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

    // M16 weapon pickup logic

    let distanceToWeapon = Phaser.Math.Distance.Between(
      this.player.sprite.x,
      this.player.sprite.y,
      //this.m16.x,
      //this.m16.y
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
    /*if (tile.index === 3) {
      // 
      this.bullets = []; 
      this.scene.pause();
      this.scene.stop();
      this.scene.launch('GameOverScene');
    }
    if (tile.index === 1) { // 
      this.map.putTileAt(-1, tile.x, tile.y);
      
    }*/
  }
}



function handlePlayerEnemyCollision(playerSprite, enemySprite) {
  if (!this.player.isInvulnerable) {
      // Handle player damage and invulnerability
      handlePlayerDamage(this.player, 1, this); 
      this.player.isInvulnerable = true;
      this.time.delayedCall(1000, () => {
          this.player.isInvulnerable = false;
      }, [], this);

      // const knockbackForce = 200;
      // let knockbackDirection;
      
      // determine the direction of the knockback
      // if (this.player.facing === 'left') {
      //     knockbackDirection = 1; // Knockback to the right
      // } else if (this.player.facing === 'right') {
      //     knockbackDirection = -1; // Knockback to the left
      // }

      // // Apply a knockback force to the player using knockbackDirection
      // playerSprite.setVelocityX(knockbackForce * knockbackDirection);

      // slight vertical knockback
      playerSprite.setVelocityY(-150);

      // Debugging line to check the calculated direction
      // console.log(`Knockback applied with force: ${knockbackForce * knockbackDirection}`);
  }
}
