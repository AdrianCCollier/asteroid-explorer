import Phaser from 'phaser';

import {createAsteroid, applyRotation} from './asteroid.js';

import {createTallEnemyAnimator, updateTallEnemyAnimations, 
        createFlyingEnemyAnimator, updateFlyingEnemyAnimations,
        createBossEnemyAnimator, updateBossEnemyAnimations} from './animation'

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

// export function handleEnemyMovement(scene, bullets, enemy) {
//     // Iterate over each bullet
//     bullets.forEach(bullet => {
//         if (bullet && bullet.sprite) {
//             // Check if the bullet intersects with the enemy and destroy the enemy if true
//             if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.sprite.getBounds(), enemy.sprite.getBounds())) {
//                 enemy.sprite.destroy();
//             }
//         }
//     });
// }


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
    enemy.health = 2; // Add a health property with a value of 2
    enemy.direction = 1; // Enemy initial direction (1 for right, -1 for left)
    enemy.animator = null;
    
    // Used to tell what kind of enemy
    enemy.tall = true;

    enemy.chasingPlayer = true;
    enemy.chasingCount = 0;

    createTallEnemyAnimator(scene, enemy);

    return enemy;
}
export function handleEnemyMovementInside(scene, enemy) {
  let player = scene.player

  // Calculate the direction vector from the enemy to the player.
  let dx = player.sprite.x - enemy.x
  let dy = player.sprite.y - enemy.y
  // Calculate the distance between the enemy and the player.
  let distance = Math.sqrt(dx * dx + dy * dy)

  const isSolidGroundAhead = checkForSolidGroundAhead(scene, enemy)
  enemy.shouldChasePlayer = distance < 300 // distance threshold to start chasing
  // Set a range for how close the player needs to be to trigger chasing
  if (localStorage.getItem('bossKills') == 2) {
    enemy.shouldChasePlayer = distance < 400
  }
  if (localStorage.getItem('bossKills') == 3) {
    enemy.shouldChasePlayer = distance < 500
  }
  if (localStorage.getItem('bossKills') == 4) {
    enemy.shouldChasePlayer = distance < 600
  }
  if (localStorage.getItem('bossKills') >= 5) {
    enemy.shouldChasePlayer = distance < 700
  }

  if (enemy.shouldChasePlayer)
    if (scene.player.bossChase)
      enemy.shouldChasePlayer = false;

  if (enemy.shouldChasePlayer){
    if (enemy.chasingCount == 0){
      enemy.chasingCount = 1;
      scene.player.chaseCount+=1;
    }
  }
  else{
    if (enemy.chasingCount != 0){
      enemy.chasingCount = 0;
      scene.player.chaseCount-=1;
    }
  }

  const isAtEdge = !isSolidGroundAhead

  if (enemy.shouldChasePlayer && !isAtEdge) {
    if (isAtCorner(scene, enemy)) {
      enemy.setVelocityY(-300)
    } else {
      // Normalize the direction vector
      let directionX = dx / distance // Normalized direction for X
      enemy.direction = Math.sign(directionX)
      if (directionX > 0) directionX = 1
      else directionX = -1
      enemy.setVelocityX(directionX * enemy.speed)
    }
  } else if (isAtEdge && enemy.shouldChasePlayer) {
    // Stop at the edge if there's no ground
    if (!enemy.shouldChasePlayer) {
      enemy.setVelocityX(0)
      enemy.setVelocityY(0)
    }
    // Optional: Enemy looks at the player
    enemy.direction = dx > 0 ? 1 : -1
  } else {
    // Patrol behavior
    patrolBehavior(scene, enemy)
  }

  // Update enemy animations.
  updateTallEnemyAnimations(scene, enemy)
}

function patrolBehavior(scene, enemy) {
    if (isAtCorner(scene, enemy)) {
        // Handle corner case
        enemy.direction *= -1; // Reverse direction
    } else if (checkForSolidGroundAhead(scene, enemy)) {
        // If there's ground ahead, keep moving
       enemy.setVelocityX(enemy.speed * enemy.direction);
    } else {
        // If there's no ground ahead, turn around
        enemy.direction *= -1; // Reverse direction
    }
    enemy.setVelocityX(enemy.speed * enemy.direction); // Move in the new direction
}

function isAtCorner(scene, enemy) {
    // Check the tile directly in front of the enemy at the same level
    const frontX = enemy.x + (enemy.width * 0.5 * enemy.direction);
    const frontY = enemy.y; // Check at the enemy's level, not below
    const frontAsteroidTile = scene.map.getTileAtWorldXY(frontX, frontY, true, scene.cameras.main, 'Floors');
    const frontAlienTile = scene.map.getTileAtWorldXY(frontX, frontY, true, scene.cameras.main, 'Alien Floors');

    // If there is a colliding tile directly in front, we're at a corner
    return  (frontAsteroidTile && frontAsteroidTile.collides) || (frontAlienTile && frontAlienTile.collides);
}

// Check for solid ground ahead of the enemy with more leniency
function checkForSolidGroundAhead(scene, enemy) {
    const offsetX = enemy.width * 0.5 * enemy.direction; // Half width ahead of the enemy
    const point = { x: enemy.x + offsetX, y: enemy.y + enemy.height * 1.9 }; // Half height to check ahead
    const AsteroidTile = scene.map.getTileAtWorldXY(point.x, point.y, true, scene.cameras.main, 'Floors');
    const AlienTile = scene.map.getTileAtWorldXY(point.x, point.y, true, scene.cameras.main, 'Alien Floors');
    const PlatformTile = scene.map.getTileAtWorldXY(point.x, point.y, true, scene.cameras.main, 'Platforms');

    return (AsteroidTile && AsteroidTile.collides) || (AlienTile && AlienTile.collides || (PlatformTile && PlatformTile.collides));
}

export function createFlyingEnemiesGroup(scene) {
    let flyingEnemies = scene.physics.add.group({
        allowGravity: false, // Flying enemies are not affected by gravity
        immovable: true, 
    });
    return flyingEnemies;
}

export function createFlyingEnemy(scene, group, x, y) {
    let enemy = group.create(x, y, 'enemy'); // Make sure 'enemy' corresponds to the loaded sprite key
    enemy.setCollideWorldBounds(true);

    // Disable gravity for the flying enemy
    enemy.body.setAllowGravity(false);

    // The radius for the circular physics body should be half of the width
    const collisionRadius = 16; // Half of the width or height for a 32x32 sprite

    enemy.body.setCircle(collisionRadius);

    // no offsets
    enemy.body.setOffset(0, 0);

    // Attach properties to the flying enemy
    enemy.speed = 100;
    enemy.health = 1;
    enemy.isChasing = false;

    enemy.chasingPlayer = true;
    enemy.chasingCount = 0;

    // Used to tell what kind of enemy
    enemy.flying = true;

    // Creates flying enemy animator
    createFlyingEnemyAnimator(scene, enemy);

    return enemy;
}

export function handleFlyingEnemyMovement(scene, enemy) {
    let player = scene.player.sprite; 

    // Calculate the distance to the player
    let distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

    // Set a range for how close the player needs to be to trigger chasing
    var chaseRange = 500;
    if(localStorage.getItem('bossKills') == 2) {
        chaseRange = 600;
    }
    if (localStorage.getItem('bossKills') == 3) {
      chaseRange = 700
    }
    if (localStorage.getItem('bossKills') == 4) {
      chaseRange = 800
    }
    if (localStorage.getItem('bossKills') >= 5) {
      chaseRange = 900
    }

    if (distance < chaseRange && !scene.player.bossChase) {
        // If within range, chase the player
        let directionX = (player.x - enemy.x) / distance;
        let directionY = (player.y - enemy.y) / distance;
        enemy.setVelocityX(directionX * enemy.speed); // Chase horizontally
        enemy.setVelocityY(directionY * enemy.speed); // Chase vertically
        enemy.isChasing = true;
    } else {
        // If the player is out of range, the enemy remains stationary
        enemy.setVelocityX(0);
        enemy.setVelocityY(0);
        enemy.isChasing = false;
    }

    if (distance < chaseRange){
      if (enemy.chasingCount == 0){
        enemy.chasingCount = 1;
        scene.player.chaseCount+=1;
      }
    }
    else{
      if (enemy.chasingCount != 0){
        enemy.chasingCount = 0;
        scene.player.chaseCount-=1;
      }
    }

    // Update flying enemy animations 
    updateFlyingEnemyAnimations(scene, enemy);
}

export function createBossGroup(scene) {
    let boss = scene.physics.add.group({
        allowGravity: false, // Flying enemies are not affected by gravity
        immovable: true, 
    });
    return boss;
}

export function createBoss(scene, group, x, y) {
    let boss = group.create(x, y, 'enemy'); // empty sprite
    boss.setCollideWorldBounds(true);

    boss.body.setAllowGravity(false);

    // Set up a circular physics body. The radius should be half the smallest dimension of the boss.
    const collisionRadius = Math.min(128, 96) / 2;
    boss.body.setCircle(collisionRadius);

    // Calculate offsets if the sprite's center is not the center of the circle
    const offsetX = (boss.width - collisionRadius * 2) / 2;
    const offsetY = (boss.height - collisionRadius * 2) / 2;
    boss.body.setOffset(offsetX, offsetY);

    // Attach properties to the boss
    boss.speed = 125;
    boss.health = 20; 


    // Used to tell what kind of enemy
    boss.boss = true;

    // Creates the boss's animator
    createBossEnemyAnimator(scene, boss);

    return boss;
}

var bossActivated = false;
export function handleBossMovement(scene, enemy) {
    let player = scene.player.sprite; 

    // Calculate the distance to the player
    let distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

    // Set a range for how close the player needs to be to trigger chasing
    var chaseRange = 600;

    if (scene.scene.key == "Ryugu")
      chaseRange = 250;
    else if (scene.scene.key == "Vesta")
      chaseRange = 800;
    else if (scene.scene.key == "Spyche")
      chaseRange = 700;
    else
      chaseRange = 800;

    if (distance < chaseRange || bossActivated) {
        scene.player.bossChase = true;

        bossActivated = true;
        // If within range, chase the player
        let directionX = (player.x - enemy.x) / distance;
        let directionY = (player.y - enemy.y) / distance;
        enemy.setVelocityX(directionX * enemy.speed); // Chase horizontally
        enemy.setVelocityY(directionY * enemy.speed); // Chase vertically
        enemy.isChasing = true;
    } else {
        // If the player is out of range, the enemy remains stationary
        enemy.setVelocityX(0);
        enemy.setVelocityY(0);
        enemy.isChasing = false;
    }

    enemy.direction = ((player.x - enemy.x) / distance) > 0;

    // Update boss animations
    updateBossEnemyAnimations(scene, enemy);
}

export function scaleEnemyAttributes(enemies, flyingEnemies, boss) {
    const bossKills = parseInt(localStorage.getItem('bossKills'));
  
    const speedScaleFactor = 2; // increase speed for each boss kill
    const healthScaleFactor = 1.5; // increase health for each boss kill
  
    // Scale each enemy group
    enemies.getChildren().forEach(enemy => {
      enemy.speed += bossKills * speedScaleFactor;
      enemy.health += bossKills * healthScaleFactor;
      console.log(enemy.health)
    });
    
    flyingEnemies.getChildren().forEach(enemy => {
        enemy.speed += bossKills * speedScaleFactor;
        enemy.health += bossKills * healthScaleFactor;
        console.log(enemy.health)
    });
    
    boss.getChildren().forEach(enemy => {
        enemy.speed += bossKills * speedScaleFactor;
        enemy.health += bossKills * healthScaleFactor;
        console.log(enemy.health)
    });
  }
