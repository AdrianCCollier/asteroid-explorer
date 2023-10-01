export function createAsteroid(scene, game, r){
    // Creates asteroid object with properties
    let asteroid = {
        x: game.config.width / 2,
        y: game.config.height / 2,
        radius: r,
        circle: scene.add.circle(game.config.width / 2, game.config.height / 2, r, 0x987554), // Circle texture
        collider: new Phaser.Geom.Circle(game.config.width / 2, game.config.height / 2, r) // Circle collider object
    };
    return asteroid;
}

// Will apply the rotation of am asteroid to the given object
export function applyRotation(scene, object){
    // Applies rotation to the sprite in respect to the center of the asteroid
    let rotation = scene.tweens.add({
        targets: object.sprite,
        angle: object.angle, // Rotate, depending on the object's angle
        duration: 0, // never stops
        repeat: -1, // Repeat the rotation infinitely
        ease: 'Linear', // Linear easing for constant speed
    });
    return rotation;
}