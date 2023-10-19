export function createPlayerWalk(scene){
  
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