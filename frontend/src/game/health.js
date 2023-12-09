// The HealthBar component appears at the top left part of the screen, and displays the players current health
export function loadHealthBar(scene){
  scene.load.image('health_bar', './assets/sprites/ui/health_fill.png');
  scene.load.image('health_container', './assets/sprites/ui/health_container.png');
}

export function loadShieldBar(scene){
  scene.load.image('shield_bar', './assets/sprites/ui/shield_fill.png');
  scene.load.image('shield_container', './assets/sprites/ui/shield_container.png');
}

// This function activates in Phaser's update() scenes, to keep the Health bar in place as the player moves
export function updateBars(scene){

  scene.player.healthContainer.x = scene.cameras.main.scrollX + scene.player.barOffsets[0];
  scene.player.healthContainer.y = scene.cameras.main.scrollY + scene.player.barOffsets[1];

  scene.player.healthBar.x = scene.cameras.main.scrollX + scene.player.barOffsets[2]-123;
  scene.player.healthBar.y = scene.cameras.main.scrollY + scene.player.barOffsets[3];
  
}