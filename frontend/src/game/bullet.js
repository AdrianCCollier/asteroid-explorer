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
  let speed = 10; // Speed of the bullet
  let bullet_x = player.sprite.x + player.sprite.width / 2 + w / 2; // Calculate x position of the bullet
  let bullet_y = player.sprite.y; // y position of the bullet
  
  // Creating a bullet object similar to createBullet but with different velocity and position calculations
  let bullet = {
      x: bullet_x,
      y: bullet_y,
      distanceTraveled: 0, // Initialize distanceTraveled to 0
      width: w,
      height: h,
      velX: speed, // The bullet should move horizontally at a constant speed.
      velY: 0, // The bullet should not move vertically.
      sprite: scene.add.sprite(bullet_x, bullet_y, 'bullet') // Add bullet sprite to the scene at (bullet_x, bullet_y)
  };
  
  return bullet; // Return the created bullet object
}



export function handleBulletMovements(bullets) {
  const maxDistance = 300; // Maximum distance a bullet can travel
  
  // Iterate over each bullet and update its position, check the distance traveled, 
  // and remove it if it exceeds the maximum distance.
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.velX; // Update bullet's x coordinate
    bullet.y += bullet.velY; // Update bullet's y coordinate
    bullet.sprite.x = bullet.x; // Reflect the change in sprite's x coordinate
    bullet.sprite.y = bullet.y; // Reflect the change in sprite's y coordinate
    
    // Calculate and update distance traveled by the bullet
    bullet.distanceTraveled += Math.sqrt(bullet.velX ** 2 + bullet.velY ** 2);
    
    // Check if bullet has traveled the maximum distance, if so, destroy the sprite and remove the bullet
    if (bullet.distanceTraveled >= maxDistance) {
      bullet.sprite.destroy(); // Destroy the sprite associated with the bullet
      bullets.splice(index, 1); // Remove the bullet from the bullets array
    }
  });
}

// load bullet image
export function loadBulletImage(scene) {
  scene.load.image('bullet', './assets/bullet.png');
}