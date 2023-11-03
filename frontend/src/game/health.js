export function loadHealthBar(scene){
  scene.load.image('health_bar', './assets/sprites/ui/health_fill.png');
  scene.load.image('health_container', './assets/sprites/ui/health_container.png');
}

export function loadShieldBar(scene){
  scene.load.image('shield_bar', './assets/sprites/ui/shield_fill.png');
  scene.load.image('shield_container', './assets/sprites/ui/shield_container.png');
}

export function updateBars(scene){

  scene.player.healthContainer.x = scene.cameras.main.scrollX + scene.player.barOffsets[0];
  scene.player.healthContainer.y = scene.cameras.main.scrollY + scene.player.barOffsets[1];

  scene.player.healthBar.x = scene.cameras.main.scrollX + scene.player.barOffsets[2]-123;
  scene.player.healthBar.y = scene.cameras.main.scrollY + scene.player.barOffsets[3];

  scene.player.shieldContainer.x = scene.cameras.main.scrollX + scene.player.barOffsets[4];
  scene.player.shieldContainer.y = scene.cameras.main.scrollY + scene.player.barOffsets[5];

  scene.player.shieldBar.x = scene.cameras.main.scrollX + scene.player.barOffsets[6];
  scene.player.shieldBar.y = scene.cameras.main.scrollY + scene.player.barOffsets[7];

  
}