export function addColliderWithWorld(scene, object) {
    // Check if scene and object are defined and object has a body property
    if(scene && object && object.body) {
        // Set the object to collide with the world bounds
        object.body.setCollideWorldBounds(true);
    }
}

export function addColliderWithGround(scene, object, ground) {
    // Check if scene, object, and ground are defined
    if(scene && object && ground) {
        // Add a collider between the object and the ground within the scene
        scene.physics.add.collider(object, ground);
    }
}

export function addObjectToWorld(scene, object) {
    // Check if scene and object are defined
    if(scene && object) {
        // Add the object to the existing objects of the scene
        scene.add.existing(object);
        // Enable the physics world on the object
        scene.physics.world.enable(object);
    }
}

export function addColliderBetweenObjects(scene, object1, object2) {
    // Check if scene, object1, and object2 are defined
    if(scene && object1 && object2) {
        // Add a collider between object1 and object2 within the scene
        scene.physics.add.collider(object1, object2);
    }
}