import { createPlayerInside, loadPlayerImage, handlePlayerMovementInside } from './player.js';
import { createEnemyInside, loadEnemyImage, handleEnemyMovementInside, handleEnemyMovement } from './enemy.js';
import { createWeaponInside, loadWeaponImage } from './weapons.js';
import { createBullet, handleBulletMovements, loadBulletImage } from './bullet.js';
import { createDoor, loadDoorImage } from './door.js';
import { addColliderWithWorld, addColliderWithGround, addObjectToWorld } from './collisions.js';

import Phaser from 'phaser';

export default class SidescrollerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SidescrollerScene' }); // Assigning key to this Scene
        this.player = null; // Initialize player
        this.bullets = []; // Initialize bullets array
        this.enemies = []; // Initialize enemies array
        this.waveCount = 0; // Initialize wave counter
        this.maxWaves = 5; // Maximum number of enemy waves
    }

    preload() {
        // Pre-loading necessary assets for the scene
        loadPlayerImage(this);
        loadEnemyImage(this);
        loadWeaponImage(this);
        loadBulletImage(this);
    }

    create() {
        this.checkCollision = false; // Initialize collision check
        // Setting a delayed timer to enable collision check
        this.time.delayedCall(1000, () => { this.checkCollision = true; }, [], this);

        // Player creation and setup
        this.player = createPlayerInside(this, 100, 450);
        addObjectToWorld(this, this.player.sprite);
        addColliderWithWorld(this, this.player.sprite);
        addColliderWithGround(this, this.player.sprite, this.ground);

        // Weapon creation and setup
        this.weapon = createWeaponInside(this, 200, 570, 32, 32);
        this.shootControl = { canShoot: true }; // Initialize shooting control
        this.shootCooldown = 500; // Time in ms between allowed shots

        // Setup input controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Enemy spawn timer
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnWave,
            callbackScope: this,
            repeat: this.maxWaves - 1,
        });
    }

    update() {
        // Handling Player and Enemy movements and interactions every frame
        handlePlayerMovementInside(this, this.player, this.shootControl, this.shootCooldown);
        this.enemies.forEach(enemy => handleEnemyMovementInside(this, this.bullets, enemy));
        handleBulletMovements(this.bullets);

        // Check for weapon pickup
        if (this.weapon && this.weapon.sprite && this.player && this.player.sprite &&
            Phaser.Geom.Intersects.RectangleToRectangle(this.player.sprite.getBounds(), this.weapon.sprite.getBounds())) {
            // Weapon picked up
            this.weapon.sprite.setVisible(false);
            this.player.gunSprite.setVisible(true);
            this.player.hasWeapon = true;
            this.player.canShoot = true;
        }

        // Adjust gun sprite position and rotation to match the player
        if (this.player.hasWeapon) {
            this.player.gunSprite.x = this.player.sprite.x;
            this.player.gunSprite.y = this.player.sprite.y;
            this.player.gunSprite.rotation = this.player.sprite.rotation;
        }

        // Check all enemies' status and show congratulation screen if conditions met
        if (this.checkAllEnemiesDeadTimer && this.areAllEnemiesDead()) {
            this.showCongratulationScreen();
        }
    }
    // Spawn enemies in waves until the maximum number of waves is reached
    // Also checks for all enemies dead after all waves are spawned
    spawnWave() {
        if (this.waveCount < this.maxWaves) {
            for (let i = 0; i < 5; i++) {
                this.time.addEvent({
                    delay: i * 500,
                    callback: () => {
                        let enemy = createEnemyInside(this, 800, 568 - 50 - 10);
                        this.enemies.push(enemy);
                        addObjectToWorld(this, enemy.sprite);
                        addColliderWithWorld(this, enemy.sprite);
                        addColliderWithGround(this, enemy.sprite, this.ground);
                    },
                    callbackScope: this,
                });
            }
            this.waveCount++;

            if (this.waveCount === this.maxWaves) {
                this.time.delayedCall(5000, () => {
                    this.checkAllEnemiesDeadTimer = this.time.addEvent({
                        delay: 2000,
                        callback: this.checkAllEnemiesDead,
                        callbackScope: this,
                        loop: true,
                    });
                });
            }
        }
    }
        
    // Return true if all enemies are dead or inactive
    areAllEnemiesDead() {
        return this.enemies.length === 0 || this.enemies.every(enemy => !enemy.sprite.active);
    }

    // If all enemies are dead, show congratulation screen and remove the check timer
    checkAllEnemiesDead() {
        if (this.areAllEnemiesDead()) {
            this.showCongratulationScreen();
            if (this.checkAllEnemiesDeadTimer) this.checkAllEnemiesDeadTimer.remove();
        }
    }
    
    // Displays congratulation message and restarts the level when 'R' is pressed
    showCongratulationScreen() {
        if (this.congratsText) return;

        this.congratsText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Congratulations! \n Press R to Head back to Surface!',
            { fontSize: '32px', color: '#fff' }
        ).setOrigin(0.5, 0.5);

        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.keyR.once('down', () => {
            this.congratsText.destroy();
            this.scene.start('Level1Scene');
        });
    }
}
