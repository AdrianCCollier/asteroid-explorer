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

export function createBulletInside(scene, player, w, h) {
  let speed = 15; // Speed of the bullet

  // Calculate the offset for the bullet's starting position based on the player's facing direction
  let offsetX = player.facing === 'left' ? -player.sprite.width / 2 - w / 2 : player.sprite.width / 2 + w / 2;
  
  // Apply the offset to the bullet's x position
  let bullet_x = player.sprite.x + offsetX;
  
  // The y position remains the same, as we're shooting horizontally
  let bullet_y = player.sprite.y;

  // Determine the bullet's velocity based on the player's facing direction
  let velocity = {
    x: speed * (player.facing === 'right' ? 1 : -1), // Adjust the direction based on facing
    y: 0, // The bullet should not move vertically.
  };

  // Creating a bullet object with properties like position, 
  // velocity in x and y direction, dimensions, and sprite
  let bullet = {
    x: bullet_x,
    y: bullet_y,
    distanceTraveled: 0, // Initialize distanceTraveled to 0
    width: w,
    height: h,
    velX: velocity.x, // The bullet should move horizontally at a constant speed.
    velY: velocity.y, // The bullet should not move vertically.
    sprite: scene.add.sprite(bullet_x, bullet_y, 'bullet') // Add bullet sprite to the scene at (bullet_x, bullet_y)
  };

  return bullet; // Return the created bullet object
}


export function handleBulletMovements(bullets) {
  const maxDistance = 500 // Maximum distance a bullet can travel

  // Adrian 10/28 - Fixed bullet not disappearing bug, we were previously using a forEach loop to iterate over the array, and were removing the bullets, but some bullets were getting skipped as the arrays length was decreasing. Iterating over the array in reverse fixed this issue
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i]
    bullet.x += bullet.velX // Update bullet's x coordinate
    bullet.y += bullet.velY // Update bullet's y coordinate
    bullet.sprite.x = bullet.x // Reflect the change in sprite's x coordinate
    bullet.sprite.y = bullet.y // Reflect the change in sprite's y coordinate

    // Calculate and update distance traveled by the bullet
    bullet.distanceTraveled += Math.sqrt(bullet.velX ** 2 + bullet.velY ** 2)

    // Check if bullet has traveled the maximum distance, if so, destroy the sprite and remove the bullet
    if (bullet.distanceTraveled >= maxDistance) {
      bullet.sprite.destroy()
      bullets.splice(i, 1)
    }
  }
}

// load bullet image
export function loadBulletImage(scene) {
  scene.load.image('bullet', './assets/bullet.png');
}