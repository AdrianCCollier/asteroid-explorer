// This file holds the Game class, and contains the logic for a Phaser game


// Imports Phaser, and Component from react
import React, { Component } from 'react';
import Phaser from 'phaser';

// imports style sheet
import './App.css';


// Main class for the game being created
class Game extends Component {

  // function called after a game is mounted for setup
  componentDidMount() {

    // Game setup
    let config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade', // sets the physics for the game
        arcade: {
          gravity: {y: 200} // sets gravity
        }
      },

      scene: { // sets the scene settings, in this case sets up scene with a preload function,
                // and a create function. We will also probably be using an update function eventually
        preload: preload,
        create: create
      }
    }
      

    // Preload Function (Loads assets)
    function preload(){
      // When loading an asset you assign it a keyword to reference it later on

      // Loads a local image in this case luffy jumping
      this.load.image('logo', 'images/LuffyJumping.png');

      // Loads an external image from a URL, in this case a background from Phaser's asset database
      this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    }
     
    
    // Create function (Draws assets, and adds any physics to them)
    function create(){
      // Draws sky with an (x, y) position of (400, 300)
      this.add.image(400, 300, 'sky')

      
      // Draws Luffy with an initial (x, y) position of (400, 100)
      // Also specifies that the game's physics will effect this asset
      let logo = this.physics.add.image(400, 100, 'logo')

      // Changes the width and height of Luffy and sets that new scale(size)
      const newWidth = logo.width / 2;
      const newHeight = logo.height / 2;
      logo.setScale(newWidth / logo.width, newHeight / logo.height);

      // Applies more physics to Luffy, in this case sets his initial x velocity to 200, and his initial y velocity to 20
      // Sets his bounce level for his x and y, and makes it so that the bounds of the canvas makes him bouce
      logo.setVelocity(200, 20)
      logo.setBounce(1,1)
      logo.setCollideWorldBounds(true)


      // Gets the Phaser canvas element
      const canvas = this.game.canvas;
      // Add an ID to the canvas element so that we can use CSS on it
      canvas.id = 'phaser-canvas';
    }

    // Finally creates the game with all of it's setup done
    this.game = new Phaser.Game(config);
  }


  // Called to clean/delete/unmount the canvas/game
  componentWillUnmount() {
    // Clean up your Phaser game here
    this.game.destroy(true);
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