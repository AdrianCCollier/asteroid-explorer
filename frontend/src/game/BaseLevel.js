import Phaser from 'phaser'

import {
  createPlayerInside,
  loadPlayerImage,
  handlePlayerMovementInside,
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

import { createWeaponInside, loadWeaponImage } from './weapons.js'
import { handleBulletMovements, loadBulletImage } from './bullet.js'

import {
  loadPlayerAnimations,
  createPlayerAnimations,
  updatePlayerAnimations,
  loadEnemyAnimations,
  createEnemyAnimations,
} from './animation.js'

import mapTileSet from './assets/Maps/tilesets/asteroid_floors_extruded.png'
import ControlsOverlay from './ControlsOverlay.js'
import ScoreSystem from './ScoreSystem.js'
import { loadHealthBar, loadShieldBar, updateBars } from './health'

// Loaded from public/assets — not bundled as a module import
const WALL_TILES = 'assets/tilesets/walls_lights_extruded.png'
const DOUBLE_JUMP_TIMER = 10

/**
 * BaseLevel — shared scene logic for all asteroid levels.
 *
 * Each subclass passes a config object to super():
 *   key          {string}  Phaser scene key
 *   mapJSON      {object}  Imported Tiled JSON for the floor map
 *   wallMapJSON  {object}  Imported Tiled JSON for the wall map
 *   themeKey     {string}  Audio cache key (must be unique per level)
 *   themeSound   {string}  Imported audio file
 *   themeVolume  {number}  Playback volume 0–1
 *   gravity      {number}  Physics world gravity (y)
 *   playerSpawn  {x, y}   Player start position
 *   bossSpawn    {x, y}   Boss start position
 *   weaponSpawn  {x, y}   Weapon pickup position
 */
export default class BaseLevel extends Phaser.Scene {
  constructor(config) {
    super({ key: config.key })
    this.levelConfig = config
    this.player = null
    this.bullets = []
    this.map = null
    this.levelComplete = false
  }

  preload() {
    const { themeKey, themeSound, mapJSON, wallMapJSON } = this.levelConfig

    // Loading UI
    const cx = this.scale.width / 2
    const cy = this.scale.height / 2
    this.add.rectangle(cx, cy, 420, 34, 0x333333)
    const progressBar = this.add.rectangle(cx - 207, cy, 0, 28, 0x4488ff).setOrigin(0, 0.5)
    this.add.text(cx, cy - 50, 'LOADING...', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5)
    this.add.text(cx, cy + 50, this.levelConfig.key.toUpperCase(), { fontSize: '14px', fill: '#aaaaaa' }).setOrigin(0.5)

    this.load.on('progress', (value) => { progressBar.width = 414 * value })

    loadPlayerImage(this)
    loadPlayerAnimations(this)
    loadEnemyAnimations(this)
    loadWeaponSounds(this)
    loadWeaponImage(this)
    loadBulletImage(this)

    this.load.image('tiles', mapTileSet)
    this.load.image('wallTiles', WALL_TILES)
    this.load.tilemapTiledJSON('map', mapJSON)
    this.load.tilemapTiledJSON('wallMap', wallMapJSON)
    this.load.image('galaxy', 'assets/Background.jpg')
    this.load.audio(themeKey, themeSound)

    loadHealthBar(this)
    loadShieldBar(this)
  }

  create() {
    const { gravity, themeKey, themeVolume, playerSpawn, bossSpawn, weaponSpawn } =
      this.levelConfig

    this.levelComplete = false
    this.bullets = []

    this.physics.world.gravity.y = gravity

    this.game.canvas.style.cursor = 'crosshair'

    // Theme music
    this.levelTheme = this.sound.add(themeKey, { loop: true, volume: themeVolume })
    this.levelTheme.play()

    // Score
    this.scoreManager = new ScoreSystem(this)

    // Pause menu
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.launch('PauseScene', { gameScene: this })
    })

    // Background — low scroll factor gives parallax effect
    this.add.image(960, 540, 'galaxy').setScrollFactor(0.15)

    // Enemy groups
    this.enemies = createEnemiesGroup(this)
    this.flyingEnemies = createFlyingEnemiesGroup(this)
    this.boss = createBossGroup(this)
    this.enemySleepAnimators = []

    createBoss(this, this.boss, bossSpawn.x, bossSpawn.y)

    // Brief delay before enabling collision so spawn doesn't immediately trigger damage
    this.checkCollision = false
    this.time.delayedCall(500, () => { this.checkCollision = true }, [], this)

    // Tilemap layers
    this.map = this.make.tilemap({ key: 'map' })
    const tileset = this.map.addTilesetImage('Floor_Tiles', 'tiles', 32, 32, 1, 2)
    const wallTileSet = this.map.addTilesetImage('Wall_Tiles', 'wallTiles', 32, 32, 1, 2)

    this.wallLayer = this.map.createLayer('Walls', wallTileSet, 0, 0)
    this.lightLayer = this.map.createLayer('Lights', wallTileSet, 0, 0)
    this.asteroidLayer = this.map.createLayer('Floors', tileset, 0, 0)
    this.alienLayer = this.map.createLayer('Alien Floors', tileset, 0, 0)
    this.platformLayer = this.map.createLayer('Platforms', tileset, 0, 0)

    this.asteroidLayer.setCollisionByProperty({ collides: true })
    this.alienLayer.setCollisionByProperty({ collides: true })
    this.platformLayer.setCollisionByProperty({ collides: true })

    // Enemy ↔ layer colliders
    this.physics.add.collider(this.enemies, this.asteroidLayer)
    this.physics.add.collider(this.enemies, this.alienLayer)
    this.physics.add.collider(this.enemies, this.platformLayer)
    this.physics.add.collider(this.flyingEnemies, this.asteroidLayer)
    this.physics.add.collider(this.flyingEnemies, this.alienLayer)
    this.physics.add.collider(this.boss, this.asteroidLayer)
    this.physics.add.collider(this.boss, this.alienLayer)

    // Spawn enemies from tiles marked in the Tiled map
    this.spawnLayer = this.map.createLayer('Spawns', tileset, 0, 0)
    this.spawnWalkingEnemies = []
    this.spawnFlyingEnemies = []

    this.spawnLayer.forEachTile(function (tile) {
      if (tile.properties.spawn == true) {
        const x = tile.pixelX + 16
        const y = tile.pixelY + 32
        if (Math.random() < 0.5) this.spawnWalkingEnemies.push({ x, y })
        else this.spawnFlyingEnemies.push({ x, y })
      }
    }, this)

    this.spawnWalkingEnemies.forEach((s) => createEnemyInside(this, this.enemies, s.x, s.y))
    this.spawnFlyingEnemies.forEach((s) => createFlyingEnemy(this, this.flyingEnemies, s.x, s.y))

    scaleEnemyAttributes(this.enemies, this.flyingEnemies, this.boss)

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    // Weapon pickup
    this.weapon = createWeaponInside(this, weaponSpawn.x, weaponSpawn.y, 32, 32)
    this.shootControl = { canShoot: true }
    this.shootCooldown = this._getShootCooldown()

    this.pickupText = this.add.text(300, 100, 'Press E To Pick Up', {
      fontSize: '24px',
      fill: '#FFF',
    })
    this.pickupText.setVisible(false)

    // Input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.cursors.pickup = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    // Player
    this.player = createPlayerInside(this, playerSpawn.x, playerSpawn.y)
    this.player.chaseCount = 0
    this.player.bossChase = false
    this.player.sprite.body.setSize(25, 63)
    this.player.sprite.setCollideWorldBounds(true)
    this.player.sprite.alpha = 0 // Hidden until animations initialize

    // Player ↔ layer colliders
    this.physics.add.collider(this.player.sprite, this.alienLayer, alienFloor, null, this)
    this.physics.add.collider(this.player.sprite, this.platformLayer, alienFloor, null, this)
    this.physics.add.collider(this.player.sprite, this.asteroidLayer, platformFloor, null, this)

    // Player ↔ enemy colliders
    this.physics.add.collider(this.player.sprite, this.enemies, handlePlayerEnemyCollision, null, this)
    this.physics.add.collider(this.player.sprite, this.flyingEnemies, handlePlayerEnemyCollision, null, this)
    this.physics.add.collider(this.player.sprite, this.boss, handlePlayerEnemyCollision, null, this)

    // Camera
    this.cameras.main.startFollow(this.player.sprite)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    createPlayerAnimations(this, this.player)
    createEnemyAnimations(this, this.player)

    this.overlay = new ControlsOverlay(this)

    this.cameras.main.fadeIn(400, 0, 0, 0)
  }

  update() {
    // Guard: stop processing once the level is won/lost
    if (this.levelComplete) return

    if (this.player.chaseCount < 0) this.player.chaseCount = 0

    // Player fell off the map
    if (this.player.sprite.y > this.map.heightInPixels) {
      this.bullets = []
      this.levelComplete = true
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.pause()
        this.scene.stop()
        this.scene.launch('GameOverScene')
      })
      return
    }

    this.enemies.getChildren().forEach((enemy) => {
      handleEnemyMovementInside(this, enemy)
      enemy.setDepth(2)
    })
    this.flyingEnemies.getChildren().forEach((enemy) => {
      handleFlyingEnemyMovement(this, enemy)
      enemy.setDepth(2)
    })
    this.boss.getChildren().forEach((enemy) => {
      handleBossMovement(this, enemy)
      enemy.setDepth(2)
    })

    // Defeat animations — only process each type once via the levelComplete flag
    this.enemySleepAnimators.forEach((enemy) => {
      if (enemy.type === 'tall') {
        if (!enemy.animator.anims.isPlaying && enemy.animator.body.velocity.y === 0)
          enemy.animator.anims.play('tall_alien_sleep', true)
      } else if (enemy.type === 'flying') {
        if (!enemy.animator.anims.isPlaying && enemy.animator.body.velocity.y === 0)
          enemy.animator.anims.play('flying_alien_sleep', true)
      } else if (enemy.type === 'boss' && !enemy.animator.anims.isPlaying) {
        this._handleBossDefeat()
      }
    })

    updatePlayerAnimations(this)
    updateBars(this)

    handlePlayerMovementInside(this, this.player, this.shootControl, this.shootCooldown)
    handleBulletMovements(this.bullets, this.enemies, this.flyingEnemies, this.boss, this)

    // Gun sprite faces the same direction as the player
    this.player.gunSprite.setTexture(
      this.player.facing === 'left' ? 'weapon2' : 'weapon1'
    )

    // Weapon pickup via rectangle overlap
    if (
      this.weapon?.sprite &&
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.sprite.getBounds(),
        this.weapon.sprite.getBounds()
      )
    ) {
      this.weapon.sprite.setVisible(false)
      this.player.gunSprite.setVisible(true)
      this.player.hasWeapon = false
      this.player.canShoot = false
    }

    // Keep gun sprite glued to player
    if (this.player.hasWeapon) {
      const offsetX = this.player.facing === 'left' ? -25 : 25
      this.player.gunSprite.x = this.player.sprite.x + offsetX
      this.player.gunSprite.y = this.player.sprite.y
      this.player.gunSprite.rotation = this.player.sprite.rotation
    }

    // Show pickup prompt when player is near the weapon
    const distanceToWeapon = Phaser.Math.Distance.Between(
      this.player.sprite.x,
      this.player.sprite.y,
      this.weapon.sprite.x,
      this.weapon.sprite.y
    )
    this.pickupText.setVisible(distanceToWeapon < 50)
  }

  // Determine shoot cooldown from localStorage weapon state.
  // Higher weapon levels yield lower cooldowns (faster fire rate).
  _getShootCooldown() {
    const equipped = localStorage.getItem('equipped')
    const pistolLevel = parseInt(localStorage.getItem('pistolLevel')) || 1
    const arLevel = parseInt(localStorage.getItem('arLevel')) || 1

    if (equipped === '"pistol"') {
      if (pistolLevel >= 6) return 100
      if (pistolLevel >= 4) return 300
      if (pistolLevel >= 2) return 500
      return 800
    }
    if (equipped === '"ar"') {
      if (arLevel >= 6) return 75
      if (arLevel >= 4) return 100
      if (arLevel >= 2) return 200
      return 125
    }
    if (equipped === '"shotgun"') return 600

    // Nothing equipped yet — default to pistol
    localStorage.setItem('equipped', JSON.stringify('pistol'))
    return 800
  }

  // Called exactly once when the boss death animation finishes.
  // The levelComplete flag prevents this running again on subsequent frames.
  _handleBossDefeat() {
    this.levelComplete = true

    const kills = parseInt(localStorage.getItem('bossKills')) + 1
    localStorage.setItem('bossKills', JSON.stringify(kills))

    if (kills === 1) {
      localStorage.setItem('shotgun', JSON.stringify(true))
      localStorage.setItem('equipped', JSON.stringify('shotgun'))
    } else if (kills === 2) {
      localStorage.setItem('ar', JSON.stringify(true))
      localStorage.setItem('equipped', JSON.stringify('ar'))
    }

    this.cameras.main.fadeOut(400, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.pause()
      this.scene.stop()
      this.scene.launch('WinScene')
    })
  }
}

// Passed as the overlap callback for player ↔ enemy colliders.
// Phaser calls it with the scene as `this` due to the context argument.
function handlePlayerEnemyCollision() {
  if (!this.player.isInvulnerable) {
    handlePlayerDamage(this.player, 1, this)
    this.player.isInvulnerable = true
    this.time.delayedCall(
      1500,
      () => { this.player.isInvulnerable = false },
      [],
      this
    )
  }
}
