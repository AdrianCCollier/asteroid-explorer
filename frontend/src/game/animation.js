export function loadPlayerAnimations(scene){
  // NORMAL ANIMS
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



  //SHOOTING ANIMS

  scene.load.spritesheet("walk_shoot", "./assets/sprites/player_walk_shoot.png",{
    frameWidth: 32,
    frameHeight: 64}
  );

  scene.load.spritesheet("run_shoot", "./assets/sprites/player_run_shoot.png",{
    frameWidth: 32,
    frameHeight: 64}
  );

  scene.load.spritesheet("jump_shoot", "./assets/sprites/player_jump_shoot.png",{
    frameWidth: 32,
    frameHeight: 64}
  );

  scene.load.spritesheet("idle_shoot", "./assets/sprites/player_idle_shoot.png",{
    frameWidth: 32,
    frameHeight: 64}
  );




  // SHOOTING ARMS ANIMS

  scene.load.spritesheet("unholster", "./assets/sprites/shooting/player_unholster.png",{
    frameWidth: 48,
    frameHeight: 64}
  );

  scene.load.spritesheet("holster", "./assets/sprites/shooting/player_holster.png",{
    frameWidth: 48,
    frameHeight: 64}
  );
  
  scene.load.spritesheet("shoot_holstered", "./assets/sprites/shooting/player_shoot_holstered.png",{
    frameWidth: 32,
    frameHeight: 64}
  );

  scene.load.spritesheet("shoot_straight_down", "./assets/sprites/shooting/player_shoot_straight_down.png",{
    frameWidth: 48,
    frameHeight: 64}
  );

  scene.load.spritesheet("shoot_down", "./assets/sprites/shooting/player_shoot_down.png",{
    frameWidth: 48,
    frameHeight: 64}
  );

  scene.load.spritesheet("shoot_straight", "./assets/sprites/shooting/player_shoot_straight.png",{
    frameWidth: 48,
    frameHeight: 64}
  );

  scene.load.spritesheet("shoot_up", "./assets/sprites/shooting/player_shoot_up.png",{
    frameWidth: 48,
    frameHeight: 64}
  );

  scene.load.spritesheet("shoot_straight_up", "./assets/sprites/shooting/player_shoot_straight_up.png",{
    frameWidth: 48,
    frameHeight: 64}
  );



  // GUN ANIMS

  scene.load.spritesheet("shoot_straight_up", "./assets/sprites/shooting/player_shoot_straight_up.png",{
    frameWidth: 48,
    frameHeight: 64}
  );


  scene.load.spritesheet("strap", "./assets/sprites/weapons/backpack_strap.png",{
    frameWidth: 64,
    frameHeight: 64}
  );

  scene.load.image('pistol', './assets/sprites/weapons/pistol.png');
  scene.load.image('pistol_holstered', './assets/sprites/weapons/pistol_holstered.png');
  scene.load.image('ar', './assets/sprites/weapons/ar.png');
  scene.load.image('ar_holstered', './assets/sprites/weapons/ar_holstered.png');
}


export function createPlayerAnimations(scene){
  // CREATES ANIMATIONS

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
    key: 'player_walk_shoot',
    frames: scene.anims.generateFrameNumbers('walk_shoot'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_idle_shoot',
    frames: scene.anims.generateFrameNumbers('idle_shoot'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_jump_shoot',
    frames: scene.anims.generateFrameNumbers('jump_shoot'),
    frameRate: 16,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_jump_boost',
    frames: scene.anims.generateFrameNumbers('boost'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_holster',
    frames: scene.anims.generateFrameNumbers('holster'),
    frameRate: 10,
    repeat: 0,
  })

  scene.anims.create({
    key: 'player_unholster',
    frames: scene.anims.generateFrameNumbers('unholster'),
    frameRate: 100,
    repeat: 0,
  })

  scene.anims.create({
    key: 'player_shoot_holstered',
    frames: scene.anims.generateFrameNumbers('shoot_holstered'),
    frameRate: 10,
    repeat: -1,
  })
  
  scene.anims.create({
    key: 'player_shoot_straight_down',
    frames: scene.anims.generateFrameNumbers('shoot_straight_down'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_shoot_down',
    frames: scene.anims.generateFrameNumbers('shoot_down'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_shoot_straight',
    frames: scene.anims.generateFrameNumbers('shoot_straight'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_shoot_up',
    frames: scene.anims.generateFrameNumbers('shoot_up'),
    frameRate: 10,
    repeat: -1,
  })

  scene.anims.create({
    key: 'player_shoot_straight_up',
    frames: scene.anims.generateFrameNumbers('shoot_straight_up'),
    frameRate: 10,
    repeat: -1,
  })




  // CREATES ANIMATOR OBJECTS

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

  scene.player.shootingAnimator = scene.playerAnimation = scene.add.sprite(
    scene.player.sprite.x,
    scene.player.sprite.y,
    'idle_shoot'
  )

  scene.player.armAnimator = scene.playerAnimation = scene.add.sprite(
    scene.player.sprite.x,
    scene.player.sprite.y,
    'shoot_straight'
  )



  scene.player.weaponSprite = scene.add.sprite(scene.player.x, scene.player.y, 'pistol');
  scene.player.weaponHolsteredSprite = scene.add.sprite(scene.player.x, scene.player.y, 'pistol_holstered');
  scene.player.weaponSprite.alpha = 0;

  scene.player.strapAnimator = scene.playerAnimation = scene.add.sprite(
    scene.player.sprite.x,
    scene.player.sprite.y,
    'strap'
  )
  
  scene.player.boostAnimator.alpha = 0;
}

var holsterCounter;


export function updatePlayerAnimations(scene){
  scene.player.animator.x = scene.player.sprite.x
  scene.player.animator.y = scene.player.sprite.y

  scene.player.boostAnimator.x = scene.player.sprite.x
  scene.player.boostAnimator.y = scene.player.sprite.y
  scene.player.boostAnimator.alpha = 0;

  scene.player.strapAnimator.x = scene.player.sprite.x
  scene.player.strapAnimator.y = scene.player.sprite.y

  scene.player.shootingAnimator.x = scene.player.sprite.x;
  scene.player.shootingAnimator.y = scene.player.sprite.y;

  scene.player.armAnimator.x = scene.player.sprite.x;
  scene.player.armAnimator.y = scene.player.sprite.y;

  scene.player.weaponSprite.x = scene.player.sprite.x;
  scene.player.weaponSprite.y = scene.player.sprite.y;

  scene.player.weaponHolsteredSprite.x = scene.player.sprite.x;
  scene.player.weaponHolsteredSprite.y = scene.player.sprite.y;

  

  // Sets alpha depending on shooting status
  if (!scene.player.holstered){ //shooting
    scene.player.animator.alpha = 0;
    scene.player.shootingAnimator.alpha = 100;
    scene.player.armAnimator.alpha = 100;
    //scene.player.weaponSprite.alpha = 100;
    scene.player.weaponHolsteredSprite.alpha = 0;
  }
  else{ // not shooting
    scene.player.animator.alpha = 100;
    scene.player.shootingAnimator.alpha = 0;
    scene.player.armAnimator.alpha = 0;
    scene.player.weaponSprite.alpha = 0;
    scene.player.weaponHolsteredSprite.alpha = 100;
  }

  if (scene.player.unholstering){
    if (!scene.player.armAnimator.anims.isPlaying){
      scene.player.unholstering = false;
      scene.player.armAnimator.play('player_shoot_straight', true);
      scene.player.holstered = false;
    }
  }

  if (scene.player.holstering){
    if (!scene.player.armAnimator.anims.isPlaying){
      scene.player.holstered = true;
      scene.player.holstering = false;
      scene.player.armAnimator.alpha = 0;
    }
  }

  if (scene.player.shoot){
    if (scene.player.holstered){ // play unholster
      scene.player.armAnimator.play('player_unholster', true);
      scene.player.unholstering = true;
      scene.player.holstered = false;
    }

    holsterCounter = 250;
  }
  else{
    holsterCounter -= 1;

    if (holsterCounter <= 0){
      // player holster anim
      scene.player.armAnimator.play('player_holster', true);
      scene.player.holstering = true;
    }
    //count
  }


  if (scene.player.facing == 'left'){ // look backward
    scene.player.animator.setFlipX(true) 
    scene.player.shootingAnimator.setFlipX(true) 
    scene.player.boostAnimator.setFlipX(true) 
    scene.player.strapAnimator.setFlipX(true)

    scene.player.armAnimator.setFlipX(true)
    scene.player.armAnimator.x = scene.player.sprite.x - 8;

    scene.player.weaponSprite.setFlipX(true);
    scene.player.weaponHolsteredSprite.setFlipX(true);
  }
  else { // look forward
    scene.player.animator.setFlipX(false) 
    scene.player.shootingAnimator.setFlipX(false) 
    scene.player.boostAnimator.setFlipX(false) 
    scene.player.strapAnimator.setFlipX(false)
    
    scene.player.armAnimator.setFlipX(false)
    scene.player.armAnimator.x = scene.player.sprite.x + 8;

    scene.player.weaponSprite.setFlipX(false);
    scene.player.weaponHolsteredSprite.setFlipX(false);
  }


  if (scene.player.jumping){
    if (scene.player.doubleJumping){
      scene.player.boostAnimator.alpha = 100;
      scene.player.boostAnimator.anims.play('player_jump_boost', true)
    }
    else{
      scene.player.animator.anims.play('player_jump', true)
      scene.player.shootingAnimator.anims.play('player_jump_shoot', true)
    }

  }
  else if (scene.player.walking){
    scene.player.animator.anims.play('player_walk', true)
    scene.player.shootingAnimator.anims.play('player_walk_shoot', true)
  }
  else{
    scene.player.animator.anims.play('player_idle', true)
    scene.player.shootingAnimator.anims.play('player_idle_shoot', true)
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
    enemy.x,
    enemy.y,
    'tall_walk_agro'
  )
}

export function updateEnemyAnimations(scene, enemy){
  // Making sprite invisible so animation can play
  enemy.alpha = 0;
  
  enemy.animator.setFlipX(true);
  enemy.animator.anims.play("tall_walk_alien_agro", true); // plays animation

  enemy.animator.x = enemy.x; // updates animation position
  enemy.animator.y = enemy.y; // updates animation position
}


