// The HealthBar component appears at the top left part of the screen, and displays the players current health
export function loadHealthBar(scene){
  scene.load.image('health_bar', './assets/sprites/ui/health_fill.png');
  scene.load.image('health_container', './assets/sprites/ui/health_container.png');
}

export function loadShieldBar(scene){
  scene.load.image('shield_bar', './assets/sprites/ui/shield_fill.png');
  scene.load.image('shield_container', './assets/sprites/ui/shield_container.png');
}

// Bars use setScrollFactor(0) so Phaser keeps them in screen space automatically.
// No manual position update needed.
export function updateBars(scene){}