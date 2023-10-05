import Phaser from 'phaser';

import {createAsteroid, applyRotation} from './asteroid.js';

export function createEnemy(scene, asteroid, w, h) {
    // Initialize an enemy object with given properties
    let enemy = {
        x: asteroid.x, // x-coordinate of the enemy set to the x-coordinate of the asteroid
        y: asteroid.y - asteroid.radius - h, // y-coordinate of the enemy calculated based on the asteroid's position and radius
        width: w, // width of the enemy
        height: h, // height of the enemy
        angle: 180, // angle of the enemy set to 180 degrees
        vertical: 2.75, // a pre-set value representing the vertical alignment of the enemy
        realDistance: asteroid.radius, // realDistance of the enemy set to the asteroid's radius
        sprite: scene.add.sprite(asteroid.x, asteroid.y, 'enemy'), // Adding enemy sprite to the scene at asteroid's position
        collider: null, // Initialize collider to null
        rotation: null, // Initialize rotation to null
        destroyed: false
    };
    
    // Set the enemy's collider
    enemy.collider = new Phaser.Geom.Circle(enemy.x, enemy.y, enemy.width / 2);
    
    // Apply the rotation to the enemy
    enemy.rotation = applyRotation(scene, enemy); // Calls applyRotation function to apply rotation to the enemy
    
    // Set the vertical origin of the enemy based on the asteroid's radius and enemy's width
    const verticalOrigin = (1 + (asteroid.radius / (enemy.width / 2))) / 2 + 0.5;
    
    // Apply vertical origin to the enemy's sprite and update the vertical property of the enemy
    enemy.sprite.setOrigin(0.5, verticalOrigin); // 0.5 is the horizontal center
    enemy.vertical = verticalOrigin;
    
    // Return the created enemy object
    return enemy;
}

export function handleEnemyMovement(scene, bullets, enemy) {
    // Iterate over each bullet
    bullets.forEach(bullet => {
        if (bullet && bullet.sprite) {
            // Check if the bullet intersects with the enemy and destroy the enemy if true
            if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.sprite.getBounds(), enemy.sprite.getBounds())) {
                enemy.sprite.destroy();
            }
        }
    });
}


export function loadEnemyImage(scene) {
    // Load the enemy image into the scene
    scene.load.image('enemy', './assets/alien.png');
}

export function createEnemyInside(scene, x, y) {
    // Create enemy sprite and enable physics on it
    let enemySprite = scene.add.sprite(x, y, 'enemy');
    scene.physics.world.enable(enemySprite);
    enemySprite.body.setCollideWorldBounds(true); // Make enemy collide with world bounds
    
    // Initialize an enemy object and return it
    let enemy = {
        x: x,
        y: y,
        sprite: enemySprite,
        speed: 1, // Speed of the enemy, adjustable as per need
    };
    return enemy;
}

export function handleEnemyMovementInside(scene, bullets, enemy) {
    // Assuming scene.player is defined and has x and y properties representing the player's position.
    let player = scene.player;
    
    // Calculate the direction vector from the enemy to the player
    let dx = player.sprite.x - enemy.sprite.x;
    let dy = player.sprite.y - enemy.sprite.y;

    // Calculate the distance between the enemy and the player
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        let speed = enemy.speed; // Define speed of the enemy
        
        // Normalize the direction vector and move the enemy towards the player.
        enemy.sprite.x += (speed * dx) / distance;
        enemy.sprite.y += (speed * dy) / distance;
    }
    
    // Check collision between each bullet and the enemy and destroy the enemy if they intersect
    bullets.forEach(bullet => {
        if (bullet && bullet.sprite) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.sprite.getBounds(), enemy.sprite.getBounds())) {
                enemy.sprite.destroy();
                enemy.destroyed = true;
                return true;
            }
        }
    });
    return false;
}