import {createAsteroid, applyRotation} from './asteroid.js';


export function createPlayer(scene, asteroid, w, h) {
    let player = {
        x: asteroid.x, // Sprite's x position
        y: asteroid.y, // Sprite's y position
        width: w, // Sprite's width
        height: h, // Sprite's height
        angle: 0, // Player's angle to the center of asteroid
        vertical: 2.75, // Distance to center of asteroid for setOrigin function()
        realDistance: asteroid.radius, // Real distance to center of asteroid
        gravity: 0.044, // Player gravity
        sprite: scene.add.sprite(asteroid.x, asteroid.y, 'player'),
        rotation: null, // Player's tween rotation
        collider: null // Player's collider circle
    };

    // Applies the player's rotation
    player.rotation = applyRotation(scene, player);

    // Set's initial player distance to the surface of the asteroid
    const verticalOrigin = (1 + (asteroid.radius / (player.width / 2))) / 2 + 0.5;
    player.sprite.setOrigin(0.5, verticalOrigin);
    player.vertical = verticalOrigin;

    // Sets the player's collider
    player.collider = new Phaser.Geom.Circle(player.x, player.y, player.width / 2);

    return player;
}


export function loadPlayerImage(scene){
    scene.load.image('player', './assets/Skeleton.png');
}