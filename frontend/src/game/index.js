// Import different scenes
import Level1Scene from './level1.js';
import SidescrollerScene from './sidescrollerScene.js';
import ConfirmationScene from './confirmationScene.js'; 

import React, { Component } from 'react';
import Phaser from 'phaser';

class Game extends Component {
  // function called after a game is mounted for setup
  componentDidMount() {
    let config = {
        type: Phaser.CANVAS,
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
  }

  // Called to clean/delete/unmount the canvas/game
  componentWillUnmount() {
    // Clean up your Phaser game here
    //this.game.destroy(true);
  }

  // renders the game inside of a div called game-container
  render() {
    return (
      <div id="game-container">
      </div>
    );
  }
}

export default Game;