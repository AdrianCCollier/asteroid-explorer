// Import different scenes
import Level1Scene from './level1.js'
import SidescrollerScene from './sidescrollerScene.js'
import ConfirmationScene from './confirmationScene.js'
import GameOverScene from './gameOverScene.js'

import React, { useRef, Component } from 'react'
import Phaser from 'phaser'

// import solarBackground from '../images/space_bg_blur.jpg';

class Game extends Component {
  game = null

  // function called after a game is mounted for setup
  componentDidMount() {
    let config = {
      type: Phaser.AUTO,
      width: 900,
      height: 500,
      physics: {
        default: 'arcade',
        arcade:{
          gravity: {y: 400},
        }
      },
      scene: [Level1Scene, SidescrollerScene, ConfirmationScene, GameOverScene],
    }
    this.game = new Phaser.Game(config)
  }

  // Called to clean/delete/unmount the canvas/game
  componentWillUnmount() {
    // Clean up your Phaser game here
    this.game.destroy(true)
  }

  // renders the game inside of a div called game-container
  render() {
    return (
      <div className="gameContainer">
        {/* <img src={solarBackground} alt="Solar Background" /> */}
      </div>
    )
  }
}

export default Game
