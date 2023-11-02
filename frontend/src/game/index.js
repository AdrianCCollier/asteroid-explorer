// Import different scenes
import Level1Scene from './level1.js'
import SidescrollerScene from './sidescrollerScene.js'
import SidescrollerScene2 from './sidescrollerScene2.js'
import SidescrollerScene3 from './sidescrollerScene3.js'
import ConfirmationScene from './confirmationScene.js'
import GameOverScene from './gameOverScene.js'

import React, { useRef, Component } from 'react'
import Phaser from 'phaser'

// import solarBackground from '../images/space_bg_blur.jpg';

class Game extends Component {
  game = null

  // function called after a game is mounted for setup
  componentDidMount() {
    // props passed down from react to determine which scene to load
    const { startingScene } = this.props

    let scenes = []
    switch (startingScene) {
      case 'SidescrollerScene':
        scenes = [SidescrollerScene, ConfirmationScene, GameOverScene]
        break
      case 'SidescrollerScene2':
        scenes = [SidescrollerScene2, ConfirmationScene, GameOverScene]
        break
      case 'SidescrollerScene3':
        scenes = [SidescrollerScene3, ConfirmationScene, GameOverScene]
        break
      default:
        scenes = [GameOverScene] // default case
        break
    }

    let config = {
      type: Phaser.AUTO,
      width: 900,
      height: 500,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 400 },
        },
      },
      scene: scenes,
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
