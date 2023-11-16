import Phaser from 'phaser';
const maxDistance = 800
export function createBullet(scene, player, w, h) {
  let speed = 6; // Speed of the bullet
  let bullet_x = player.x;
  let bullet_y = player.y;
  let angle = player.angle; // Angle of the player
  
  // Creating a bullet object with properties like position, 
  // velocity in x and y direction, dimensions, and sprite
  let bullet = {
      x: bullet_x,
      y: bullet_y,
      distanceTraveled: 0, // Initialize distanceTraveled to 0
      width: w,
      height: h,
      velX: speed * Math.cos(Phaser.Math.DegToRad(angle)), // Convert angle to radians and calculate velocity X
      velY: speed * Math.sin(Phaser.Math.DegToRad(angle)), // Convert angle to radians and calculate velocity Y
      sprite: scene.add.sprite(bullet_x, bullet_y, 'bullet') // Add bullet sprite to the scene at (bullet_x, bullet_y)
  };
  return bullet; // Return the created bullet object
}

export function createBulletInside(scene, player, w, h, a) {
  let speed = 8; // Speed of the bullet

  // Determine the bullet's velocity based on the player's facing angle
  let velocity = {
    x: Math.cos(a) * speed,
    y: Math.sin(a) * speed
  };

  // Creating a bullet object with properties like position, 
  // velocity in x and y direction, dimensions, and sprite
  let bullet = {
    x: player.sprite.x,
    y: player.sprite.y,
    distanceTraveled: 0, // Initialize distanceTraveled to 0
    width: w,
    height: h,
    angle: a,
    velX: velocity.x, // The bullet should move horizontally at a constant speed.
    velY: velocity.y, // The bullet should not move vertically.
    sprite: scene.physics.add.sprite(player.sprite.x, player.sprite.y, 'bullet'), // Add bullet sprite to the scene at (bullet_x, bullet_y)
  };

  // Set the bullet's velocity
  bullet.sprite.setVelocity(velocity.x, velocity.y);

  bullet.sprite.setRotation(a);

  // Stops gravity from affecting bullet
  bullet.sprite.body.setAllowGravity(false);

  // Adjust hitbox size
  bullet.sprite.setSize(8, 8);

  // Add collision with enemies
  scene.physics.add.collider(bullet.sprite, scene.enemies, function(bulletSprite, alien) {
    // Remove the bullet
    bulletSprite.destroy();
    bullet.distanceTraveled = 800;

    // Decrease the enemy's health
    alien.health -= 1;
    alien.setVelocityY(-150)
    // Check if the enemy is dead
    if (alien.health <= 0) {
        // Remove the enemy if health is 0 or less
        alien.destroy();  
        if (alien.animator) {
            alien.animator.destroy();
        }
        
        // Check if the enemy belongs to the enemies group
        if (scene.enemies.contains(alien)) {
            // Remove the enemy from the group
            scene.enemies.remove(alien, true, true);
        }
    }
});
  // Add collision with enemies
  scene.physics.add.collider(bullet.sprite, scene.flyingEnemies, function(bulletSprite, alien) {
    // Remove the bullet
    bulletSprite.destroy();
    bullet.distanceTraveled = 800;

    // Decrease the enemy's health
    alien.health -= 1;

    // Check if the enemy is dead
    if (alien.health <= 0) {
        // Remove the enemy if health is 0 or less
        alien.destroy();  
        if (alien.animator) {
            alien.animator.destroy();
        }
        
        // Check if the enemy belongs to the enemies group
        if (scene.enemies.contains(alien)) {
            // Remove the enemy from the group
            scene.enemies.remove(alien, true, true);
        }
    }
});
  // Add collision with enemies
  scene.physics.add.collider(bullet.sprite, scene.boss, function(bulletSprite, alien) {
    // Remove the bullet
    bulletSprite.destroy();
    bullet.distanceTraveled = 800;

    // Decrease the enemy's health
    alien.health -= 1;

    // Check if the enemy is dead
    if (alien.health <= 0) {
        // Remove the enemy if health is 0 or less
        alien.destroy();  
        if (alien.animator) {
            alien.animator.destroy();
        }
        
        // Check if the enemy belongs to the enemies group
        if (scene.enemies.contains(alien)) {
            // Remove the enemy from the group
            scene.enemies.remove(alien, true, true);
        }
    }
});

  // Add collision with asteroid layer
  scene.physics.add.collider(bullet.sprite, scene.asteroidLayer, function() {
    bullet.distanceTraveled = 800;
  });
  // Add collision with alien layer
  scene.physics.add.collider(bullet.sprite, scene.alienLayer, function() {
    bullet.distanceTraveled = 800;
  });
  // Add collision with platform layer
  scene.physics.add.collider(bullet.sprite, scene.platformLayer, function() {
    bullet.distanceTraveled = 800;
  });
  return bullet; // Return the created bullet object
}


export function handleBulletMovements(bullets, enemies, flyingEnemies, boss) {
  const hitRadius = 20; // Define a hit radius for rough collision detection

  bullets.forEach((bullet, index) => {
    // Move bullet
    bullet.x += bullet.velX;
    bullet.y += bullet.velY;

    // Update sprite position
    bullet.sprite.x = bullet.x;
    bullet.sprite.y = bullet.y;

    // Calculate distance traveled
    bullet.distanceTraveled += Math.sqrt(bullet.velX ** 2 + bullet.velY ** 2);

    // Check for proximity-based collision with enemies
    let allEnemies = enemies.getChildren().concat(flyingEnemies.getChildren(), [boss]);
    for (let alien of allEnemies) {
      if (Phaser.Math.Distance.Between(bullet.x, bullet.y, alien.x, alien.y) < hitRadius) {
        handleEnemyHit(bullet, alien);
        bullets.splice(index, 1); // Remove the bullet from the array
        return; // Exit the loop early since the bullet is destroyed
      }
    }

    // Remove bullet if it has traveled the maximum distance
    if (bullet.distanceTraveled >= maxDistance) {
      bullet.sprite.destroy();
      bullets.splice(index, 1);
    }
  });
}

// load bullet image
export function loadBulletImage(scene) {
  scene.load.image('bullet', './assets/bullet.png');
}

function handleEnemyHit(bullet, alien) {
  // Decrease the enemy's health or handle as necessary
  alien.health -= 1;
  // Destroy the bullet sprite
  bullet.sprite.destroy();
  // Set bullet distance traveled to max to ensure it's removed from the update loop
  bullet.distanceTraveled = maxDistance;

  if (alien.health <= 0) {
    alien.destroy();
    if (alien.animator) {
      alien.animator.destroy();
    }
  }
}