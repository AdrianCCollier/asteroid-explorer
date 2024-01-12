import Phaser from 'phaser'
const maxDistance = 1200

// Creates a bullet that varies depending on the current weapon
export function createBulletInside(scene, player, w, h, a) {
  var bulletType = 'bullet'
  var speed = 8

  var newBulletWidth = 8
  var newBulletHeight = 8

  if (localStorage.getItem('equipped') == '"pistol"') {
    bulletType = 'pistolBullet'
    speed = 14
    newBulletWidth = 16
    newBulletHeight = 16
  } else if (localStorage.getItem('equipped') == '"ar"') {
    bulletType = 'ARBullet'
    speed = 14
    newBulletWidth = 10
    newBulletHeight = 16
  } else if (localStorage.getItem('equipped') == '"shotgun"') {
    bulletType = 'shotgunBullet'
    speed = 16
    newBulletWidth = 8
    newBulletHeight = 16
  } else {
    console.log('ERROR: ' + localStorage.getItem('equipped'))
  }

  // Determine the bullet's velocity based on the player's facing angle
  let velocity = {
    x: Math.cos(a) * speed,
    y: Math.sin(a) * speed,
  }

  // Creating a bullet object with properties like position,
  // velocity in x and y direction, dimensions, and sprite
  let bullet = {
    x: player.sprite.x,
    y: player.sprite.y - 8,
    distanceTraveled: 0, // Initialize distanceTraveled to 0
    width: w,
    height: h,
    angle: a,
    velX: velocity.x, // The bullet should move horizontally at a constant speed.
    velY: velocity.y, // The bullet should not move vertically.
    sprite: scene.physics.add.sprite(
      player.sprite.x,
      player.sprite.y - 8,
      bulletType
    ), // Add bullet sprite to the scene at (bullet_x, bullet_y)
  }

  // Set the bullet's velocity
  bullet.sprite.setVelocity(velocity.x, velocity.y)

  bullet.sprite.setRotation(a)

  // Stops gravity from affecting bullet
  bullet.sprite.body.setAllowGravity(false)

  // Adjust hitbox size
  bullet.sprite.setSize(newBulletWidth, newBulletHeight)

  // Update the scale property to change the width and height
  bullet.sprite.setScale(
    newBulletWidth / bullet.sprite.width,
    newBulletHeight / bullet.sprite.height
  )

  // Add collision with enemies
  scene.physics.add.collider(
    bullet.sprite,
    scene.boss,
    function (bulletSprite, alien) {
      alien.animator.setTint(0xff7e87) // Tints the alien red for a frame showing damage
      console.log('boss got shot lol, increase score here by 20')
      scene.scoreManager.increasePoints(20)

      // for now, store all points into local storage
      localStorage.setItem(
        'playerPoints',
        scene.scoreManager.getCurrentPoints()
      )

      // Set a timeout to revert the color after a short duration
      setTimeout(() => {
        alien.animator.clearTint() // Clear the tint to revert to the original color
      }, 100) // Adjust the duration as needed (100 milliseconds in this example)

      // Remove the bullet
      bulletSprite.destroy()
      bullet.distanceTraveled = 800

      // Decrease the enemy's health
      alien.health -= 0.75

      // Check if the enemy is dead
      if (alien.health <= 0) {
        // Remove the enemy if health is 0 or less

        console.log('about to reward 500 pts')
        // if boss dies, reward 500 points
        scene.scoreManager.increasePoints(500)

        // store in local storage before destroying alien
        localStorage.setItem(
          'playerPoints',
          scene.scoreManager.getCurrentPoints()
        )
        console.log('rewarded 500 pts')

        alien.destroy()
        if (alien.animator) {
          scene.physics.world.enable(alien.animator)
          scene.physics.add.collider(alien.animator, scene.asteroidLayer)
          scene.physics.add.collider(alien.animator, scene.alienLayer)
          scene.physics.add.collider(alien.animator, scene.platformLayer)
          alien.animator.anims.play('boss_alien_death', true) // simply plays boss death
        }

        // Check if the enemy belongs to the enemies group
        if (scene.enemies.contains(alien)) {
          // Remove the enemy from the group
          scene.enemies.remove(alien, true, true)
        }

        scene.enemySleepAnimators.push({
          animator: alien.animator,
          type: 'boss',
        })
      }
    }
  )

  // Add collision with asteroid layer
  scene.physics.add.collider(bullet.sprite, scene.asteroidLayer, function () {
    bullet.distanceTraveled = 800
  })
  // Add collision with alien layer
  scene.physics.add.collider(bullet.sprite, scene.alienLayer, function () {
    bullet.distanceTraveled = 800
  })
  // Add collision with platform layer
  scene.physics.add.collider(bullet.sprite, scene.platformLayer, function () {
    bullet.distanceTraveled = 800
  })
  return bullet // Return the created bullet object
}

export function handleBulletMovements(
  bullets,
  enemies,
  flyingEnemies,
  boss,
  scene
) {
  const hitRadius = 20 // Define a hit radius for rough collision detection

  bullets.forEach((bullet, index) => {
    // Move bullet
    bullet.x += bullet.velX
    bullet.y += bullet.velY

    // Update sprite position
    bullet.sprite.x = bullet.x
    bullet.sprite.y = bullet.y

    // Calculate distance traveled
    bullet.distanceTraveled += Math.sqrt(bullet.velX ** 2 + bullet.velY ** 2)

    // Check for proximity-based collision with enemies
    let allEnemies = enemies
      .getChildren()
      .concat(flyingEnemies.getChildren(), [boss])
    for (let alien of allEnemies) {
      if (
        Phaser.Math.Distance.Between(bullet.x, bullet.y, alien.x, alien.y) <
        hitRadius
      ) {
        handleEnemyHit(bullet, alien, scene)
        bullets.splice(index, 1) // Remove the bullet from the array
        return // Exit the loop early since the bullet is destroyed
      }
    }

    // Remove bullet if it has traveled the maximum distance
    if (bullet.distanceTraveled >= maxDistance) {
      bullet.sprite.destroy()
      bullets.splice(index, 1)
    }
  })
}

// load bullet image
export function loadBulletImage(scene) {
  scene.load.image('bullet', './assets/bullet.png')

  scene.load.image('spacePistol', './assets/sprites/weapons/spacePistol.png')
  scene.load.image('spaceAR', './assets/sprites/weapons/spaceAR.png')
  scene.load.image('spaceShotgun', './assets/sprites/weapons/spaceShotgun.png')

  scene.load.image(
    'pistolBullet',
    './assets/sprites/weapons/spacePistolBullets.png'
  )
  scene.load.image('ARBullet', './assets/sprites/weapons/spaceARBullets.png')
  scene.load.image(
    'shotgunBullet',
    './assets/sprites/weapons/spaceShotgunBullets.png'
  )
}

function handleEnemyHit(bullet, alien, scene) {
  // Decrease the enemy's health or handle as necessary

  // Increase hit damage based on weapon levels
  if (localStorage.getItem('pistolLevel') == 3 || localStorage.getItem('pistolLevel') == 4) {
    alien.health -= 1.5
  }
  if (localStorage.getItem('pistolLevel') == 5 || localStorage.getItem('pistolLevel') == 6) {
    alien.health -= 2.5
  }
  if (localStorage.getItem('pistolLevel') >= 7) {
    alien.health -= 3.5
  }

  if (localStorage.getItem('arLevel') == 3 || localStorage.getItem('arLevel') == 4) {
    alien.health -= 1.5
  }
  if (localStorage.getItem('arLevel') == 5 || localStorage.getItem('arLevel') == 6) {
    alien.health -= 2.5
  }
  if (localStorage.getItem('arLevel') >= 7) {
    alien.health -= 3.5
  }
  if (localStorage.getItem('shotgunLevel') == 3 || localStorage.getItem('shotgunLevel') == 4) {
    alien.health -= 1.5  
  }
  if (localStorage.getItem('shotgunLevel') == 5 || localStorage.getItem('shotgunLevel') == 6) {
    alien.health -= 2.5
  }
  if (localStorage.getItem('shotgunLevel') >= 7) {
    alien.health -= 3.5
  }
  alien.health -= 1
  console.log('alien got shot lol, increase score by 10')
  scene.scoreManager.increasePoints(10)
  // local storage
  localStorage.setItem('playerPoints', scene.scoreManager.getCurrentPoints())

  // Destroy the bullet sprite
  bullet.sprite.destroy()
  // Set bullet distance traveled to max to ensure it's removed from the update loop
  bullet.distanceTraveled = maxDistance

  alien.animator.setTint(0xff7e87) // Tints the alien red for a frame showing damage

  // Set a timeout to revert the color after a short duration
  setTimeout(() => {
    alien.animator.clearTint() // Clear the tint to revert to the original color
  }, 100) // Adjust the duration as needed (100 milliseconds in this example)

  if (alien.health <= 0) {
    if (scene.player.chaseCount > 0){
      scene.player.chaseCount -= 1;
    }

    // Saves alien's animator for sleep animation
    var sleepAnimator

    // Sets up sleep animator object and adds collisions and gravity
    sleepAnimator = { animator: alien.animator, type: '' }
    scene.physics.world.enable(sleepAnimator.animator)
    scene.physics.add.collider(sleepAnimator.animator, scene.asteroidLayer)
    scene.physics.add.collider(sleepAnimator.animator, scene.alienLayer)
    scene.physics.add.collider(sleepAnimator.animator, scene.platformLayer)

    // Determines the type of alien
    if (alien.tall) {
      sleepAnimator.animator.anims.play('tall_alien_knockout', true)
      sleepAnimator.type = 'tall'
      scene.enemySleepAnimators.push(sleepAnimator)
    } else if (alien.flying) {
      alien.animator.anims.play('flying_alien_knockout', true)
      sleepAnimator.type = 'flying'
      scene.enemySleepAnimators.push(sleepAnimator)
    }

    alien.destroy()
  }
}
