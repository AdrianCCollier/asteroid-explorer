export function loadPlayerAnimations(scene){
  scene.load.spritesheet("walk", "./assets/sprites/player_walk.png",{
      frameWidth: 32,
      frameHeight: 64}
  );
  
  scene.load.spritesheet("run", "./assets/sprites/player_run.png",{
      frameWidth: 32,
      frameHeight: 64}
  );

  scene.load.spritesheet("jump", "./assets/sprites/player_jump.png",{
      frameWidth: 32,
      frameHeight: 64}
  );

  scene.load.spritesheet("idle", "./assets/sprites/player_idle.png",{
      frameWidth: 32,
      frameHeight: 64}
  );

  scene.load.spritesheet("boost", "./assets/sprites/player_jump_boost.png",{
    frameWidth: 32,
    frameHeight: 64}
);
}



export function createPlayerAnimations(scene){
  // Create the animations
  scene.anims.create({
    key: 'player_walk',
    frames: scene.anims.generateFrameNumbers('walk'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_idle',
    frames: scene.anims.generateFrameNumbers('idle'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_jump',
    frames: scene.anims.generateFrameNumbers('jump'),
    frameRate: 16,
    repeat: -1,
  })



  scene.anims.create({
    key: 'player_jump_boost',
    frames: scene.anims.generateFrameNumbers('boost'),
    frameRate: 10,
    repeat: -1,
  })




  // sets the animator objects for player
  scene.player.boostAnimator = scene.playerAnimation = scene.add.sprite(
    scene.player.sprite.x,
    scene.player.sprite.y,
    'boost'
  )
  
  scene.player.animator = scene.playerAnimation = scene.add.sprite(
    scene.player.sprite.x,
    scene.player.sprite.y,
    'idle'
  )

  
  scene.player.boostAnimator.alpha = 0;
}

export function updatePlayerAnimations(scene){
  scene.player.animator.x = scene.player.sprite.x
  scene.player.animator.y = scene.player.sprite.y

  scene.player.boostAnimator.x = scene.player.sprite.x
  scene.player.boostAnimator.y = scene.player.sprite.y
  scene.player.boostAnimator.alpha = 0;



  if (scene.player.facing == 'left'){ // look backward
    scene.player.animator.setFlipX(true) 
    scene.player.boostAnimator.setFlipX(true) 
  }
  else { // look forward
    scene.player.animator.setFlipX(false) 
    scene.player.boostAnimator.setFlipX(false) 
  }


  if (scene.player.jumping){
    if (scene.player.doubleJumping){
      scene.player.boostAnimator.alpha = 100;
      scene.player.boostAnimator.anims.play('player_jump_boost', true)
    }
    else{
      scene.player.animator.anims.play('player_jump', true)
    }

  }
  else if (scene.player.walking){
    scene.player.animator.anims.play('player_walk', true)
  }
  else{
    scene.player.animator.anims.play('player_idle', true)
  }
}

export function updatePlayerWalk(scene){
  scene.walk = scene.add.sprite(scene.player.x, scene.player.y, "walk");

  // Create the animation
  scene.anims.create({
    key: "player_walk",
    frames: scene.anims.generateFrameNumbers("walk"),
    frameRate: 10,
    repeat: -1,
  });

  return scene;
}













export function loadEnemyAnimations(scene){
  scene.load.spritesheet("tall_walk_agro", "./assets/sprites/tall_alien_walking_agro.png",{
    frameWidth: 32,
    frameHeight: 64}
  );
}

export function createEnemyAnimations(scene){
  scene.anims.create({
    key: 'tall_walk_alien_agro',
    frames: scene.anims.generateFrameNumbers('tall_walk_agro'),
    frameRate: 16,
    repeat: -1,
  })
}

export function createEnemyAnimator(scene, enemy){
  enemy.animator = scene.playerAnimation = scene.add.sprite(
    enemy.sprite.x,
    enemy.sprite.y,
    'tall_walk_agro'
  )
}

export function updateEnemyAnimations(scene, enemy){
  // Making sprite invisible so animation can play
  enemy.sprite.alpha = 0;
  
  enemy.animator.setFlipX(true);
  enemy.animator.anims.play("tall_walk_alien_agro", true); // plays animation

  enemy.animator.x = enemy.sprite.x; // updates animation position
  enemy.animator.y = enemy.sprite.y; // updates animation position
}