// Import different scenes
import Level1Scene from './level1.js';
import SidescrollerScene from './sidescrollerScene.js';
import ConfirmationScene from './confirmationScene.js'; 

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [Level1Scene, SidescrollerScene,ConfirmationScene]
};

let game = new Phaser.Game(config);
