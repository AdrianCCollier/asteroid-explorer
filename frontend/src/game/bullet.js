import Phaser from 'phaser';

export function createBullet(scene, player, w, h) {
  let speed = 10; // Speed of the bullet
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

  // Stops gravity from affecting bullet
  bullet.sprite.body.setAllowGravity(false);

  // Adjust hitbox size
  bullet.sprite.setSize(8, 8);

  // Add collision with enemies
  scene.physics.add.collider(bullet.sprite, scene.enemies, function(bullet, alien) {
    // Removes the bullet
    bullet.destroy(); 
    bullet.distanceTraveled = 800;

    // Removes the alien
    alien.destroy();  
    alien.animator.destroy();

    // Check if the alien belongs to the enemies group
    if (scene.enemies.contains(alien)) {
      // Remove the alien from the group
      scene.enemies.remove(alien, true, true);
    }
  });

  // Add collision with scene.layer
  scene.physics.add.collider(bullet.sprite, scene.layer, function() {
    bullet.distanceTraveled = 800;
  });




  return bullet; // Return the created bullet object
}


export function handleBulletMovements(bullets) {
  const maxDistance = 800; // Maximum distance a bullet can travel

  // Iterate over each bullet and update its position, check the distance traveled, 
  // and remove it if it exceeds the maximum distance.
  bullets.forEach((bullet, index) => {
    // Check if bullet has traveled the maximum distance, if so, destroy the sprite and remove the bullet
    if (bullet.distanceTraveled >= maxDistance) {
      bullet.sprite.destroy(); // Destroy the sprite associated with the bullet
      bullets.splice(index, 1); // Remove the bullet from the bullets array
    }
    else{
      bullet.x += bullet.velX; // Update bullet's x coordinate
      bullet.y += bullet.velY; // Update bullet's y coordinate

      bullet.sprite.x = bullet.x; // Reflect the change in sprite's x coordinate
      bullet.sprite.y = bullet.y; // Reflect the change in sprite's y coordinate
      
      // Calculate and update distance traveled by the bullet
      bullet.distanceTraveled += Math.sqrt(bullet.velX ** 2 + bullet.velY ** 2);
    }
  });
}

// load bullet image
export function loadBulletImage(scene) {
  scene.load.image('bullet', './assets/bullet.png');
}