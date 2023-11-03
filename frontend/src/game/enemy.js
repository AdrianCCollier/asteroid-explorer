import Phaser from 'phaser';

import {createAsteroid, applyRotation} from './asteroid.js';

import {createEnemyAnimator, updateEnemyAnimations} from './animation'

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
        destroyed: false,
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
///
export function createEnemiesGroup(scene) {
    let enemies = scene.physics.add.group();
    return enemies;
}
export function createEnemyInside(scene, group, x, y) {
    let enemy = group.create(x, y, 'enemy');
    enemy.setCollideWorldBounds(true); // Make enemy collide with world bounds

    // Adjust the size of the enemy's physics body
    // Keep the width slightly less than full width for leniency
    const collisionWidth = enemy.width * 0.8;
    // Set the height to full height to cover the entire sprite
    const collisionHeight = enemy.height*1.9;

    // Offset to center since collision is changed
    // Center the collision body on the sprite visually
    const offsetX = (enemy.width - collisionWidth) / 2;
    const offsetY = (enemy.height - collisionHeight) / 2;
    enemy.body.setSize(collisionWidth, collisionHeight);
    enemy.body.setOffset(offsetX, offsetY);

    // Attach properties to the sprite directly
    enemy.speed = 50;
    enemy.direction = 1; // Enemy initial direction (1 for right, -1 for left)
    enemy.animator = null;
    createEnemyAnimator(scene, enemy);

    return enemy;
}
export function handleEnemyMovementInside(scene, bullets, enemy) {
    let player = scene.player;

    // Calculate the direction vector from the enemy to the player.
    let dx = player.sprite.x - enemy.x;
    let dy = player.sprite.y - enemy.y;

    // Calculate the distance between the enemy and the player.
    let distance = Math.sqrt(dx * dx + dy * dy);

    const isSolidGroundAhead = checkForSolidGroundAhead(scene, enemy);
    const shouldChasePlayer = distance < 200; // distance threshold to start chasing
    const isAtEdge = !isSolidGroundAhead;
    
    if (shouldChasePlayer && !isAtEdge) {
        // Normalize the direction vector 
        let directionX = dx / distance; // Normalized direction for X
        enemy.direction = Math.sign(directionX);
        enemy.setVelocityX(directionX * enemy.speed);
    } else if (isAtEdge && shouldChasePlayer) {
        // Stop at the edge if there's no ground
        enemy.setVelocityX(0);
        // Optional: Enemy looks at the player
        enemy.direction = dx > 0 ? 1 : -1;
    } else {
        // Patrol behavior
        patrolBehavior(scene, enemy);
    }

    // Update enemy animations.
    updateEnemyAnimations(scene, enemy);
}

function patrolBehavior(scene, enemy) {
    // If there's ground ahead, keep moving
    if (checkForSolidGroundAhead(scene, enemy)) {
        enemy.setVelocityX(enemy.speed * enemy.direction);
    } else {
        // If there's no ground ahead, turn around
        enemy.direction *= -1; // Reverse direction
        enemy.setVelocityX(enemy.speed * enemy.direction); // Move in the new direction
    }
}

// Check for solid ground ahead of the enemy with more leniency
function checkForSolidGroundAhead(scene, enemy) {
    const offsetX = enemy.width * 0.5 * enemy.direction; // Half width ahead of the enemy
    const point = { x: enemy.x + offsetX, y: enemy.y + enemy.height * 1.9 }; // Half height to check ahead
    const tile = scene.map.getTileAtWorldXY(point.x, point.y, true, scene.cameras.main, 'Tile Layer 1');
    return tile && tile.collides;
}
