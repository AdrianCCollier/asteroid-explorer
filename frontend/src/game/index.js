// Import different scenes
import Ryugu from './ryugu.js'
import Vesta from './vesta.js'
import Psyche from './psyche.js'
import Ceres from './ceres.js'

import Level1Scene from './level1.js'
import SidescrollerScene from './sidescrollerScene.js'
import SidescrollerScene2 from './sidescrollerScene2.js'
import SidescrollerScene3 from './sidescrollerScene3.js'
import ConfirmationScene from './confirmationScene.js'
import GameOverScene from './gameOverScene.js'
import WinScene from './winScene.js'

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
        scenes = [SidescrollerScene, ConfirmationScene, GameOverScene, WinScene]
        break
      case 'SidescrollerScene2':
        scenes = [SidescrollerScene2, ConfirmationScene, GameOverScene, WinScene]
        break
      case 'SidescrollerScene3':
        scenes = [SidescrollerScene3, ConfirmationScene, GameOverScene, WinScene]
        break
      case 'Ryugu':
        scenes = [Ryugu, ConfirmationScene, GameOverScene, WinScene]
        break;
      case 'Vesta':
        scenes = [Vesta, ConfirmationScene, GameOverScene, WinScene]
        break;
      case 'Psyche':
        scenes = [Psyche, ConfirmationScene, GameOverScene, WinScene]
        break;
      case 'Ceres':
        scenes = [Ceres, ConfirmationScene, GameOverScene, WinScene]
        break;
      default:
        scenes = [GameOverScene] // default case
        break
    }

    let config = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 400 },
          //debug: true,
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
