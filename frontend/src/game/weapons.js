import Phaser from 'phaser';
import Inventory from '../Inventory.js'
export function createWeapon(scene, asteroid, w, h) {

  // Calculate position for the weapon
  let weaponSpawnX = asteroid.x + Math.cos(0) * (asteroid.radius + h); 
  let weaponSpawnY = asteroid.y + Math.sin(0) * (asteroid.radius + h); 

  let weapon = {
      x: weaponSpawnX,
      y: weaponSpawnY,
      width: w,
      height: h,
      sprite: scene.add.sprite(weaponSpawnX, weaponSpawnY, 'weapon1'),
      collider: new Phaser.Geom.Circle(weaponSpawnX, weaponSpawnY, w / 2),
  };
  return weapon;
}

// Load weapon images
export function loadWeaponImage(scene) {
  scene.load.image('weapon1', './assets/mini.png');
  scene.load.image('weapon2', './assets/miniLeft.png');
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
      sprite: scene.add.sprite(weaponSpawnX, weaponSpawnY, 'weapon1'),
      collider: new Phaser.Geom.Circle(weaponSpawnX, weaponSpawnY, w / 2),
  };
  return weapon;
}

// Uses Inventory object and functions coming from Inventory.js
export function unlockWeapon(weapon) {

  Inventory.unlockItem(weapon);
  console.log(`${weapon} unlocked`)

  // Testing, just prints array
  const allUnlockedItems = Inventory.getAllUnlockedItems()
  console.log('All unlocked items:', allUnlockedItems)
}
