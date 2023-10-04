import Phaser from 'phaser';

export function createWeapon(scene, asteroid, w, h) {

  // Calculate position for the weapon
  let weaponSpawnX = asteroid.x + Math.cos(0) * (asteroid.radius + h); 
  let weaponSpawnY = asteroid.y + Math.sin(0) * (asteroid.radius + h); 

  let weapon = {
      x: weaponSpawnX,
      y: weaponSpawnY,
      width: w,
      height: h,
      sprite: scene.add.sprite(weaponSpawnX, weaponSpawnY, 'weapon'),
      collider: new Phaser.Geom.Circle(weaponSpawnX, weaponSpawnY, w / 2),
  };
  return weapon;
}

export function loadWeaponImage(scene) {
  scene.load.image('weapon', './assets/mini.png');
}

export function createWeaponInside(scene, x, y, w, h) {

  // Calculate position for the weapon
  let weaponSpawnX = x;
  let weaponSpawnY = y;

  let weapon = {
      x: weaponSpawnX,
      y: weaponSpawnY,
      width: w,
      height: h,
      sprite: scene.add.sprite(weaponSpawnX, weaponSpawnY, 'weapon'),
      collider: new Phaser.Geom.Circle(weaponSpawnX, weaponSpawnY, w / 2),
  };
  return weapon;
}
