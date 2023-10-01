import {createAsteroid, applyRotation} from './asteroid.js';

export function createDoor(scene, asteroid, w, h) {
    // Create a door object with its position, dimensions, angle, and other properties
    let door = {
        x: asteroid.x, // x-coordinate of the door set to the x-coordinate of the asteroid
        y: asteroid.y - asteroid.radius - h, // y-coordinate of the door calculated based on the asteroid's position and radius
        width: w, // width of the door
        height: h, // height of the door
        angle: 270, // angle of the door set to 270 degrees
        vertical: 2.75, // a pre-set value representing the vertical alignment of the door
        realDistance: asteroid.radius, // realDistance of the door set to the asteroid's radius
        sprite: scene.add.sprite(asteroid.x, asteroid.y, 'door'), // Adding door sprite to the scene at asteroid's position
        collider: null, // Initialize collider to null
        rotation: null // Initialize rotation to null
    };
    
    // Applies the rotation from the asteroid to the door
    door.rotation = applyRotation(scene, door); // Calls applyRotation function to apply rotation to the door
    
    // Set the vertical origin of the door based on the asteroid's radius and door's width
    const verticalOrigin = (1 + (asteroid.radius / (door.width / 2))) / 2 + 0.5;
    
    // Apply vertical origin to the door's sprite and update the vertical property of the door
    door.sprite.setOrigin(0.5, verticalOrigin); // 0.5 is the horizontal center
    door.vertical = verticalOrigin;
    
    // Return the created door object
    return door;
}


export function loadDoorImage(scene) {
  // Load the door image into the scene
  scene.load.image('door', './assets/door.png');
}