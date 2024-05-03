// Import different scenes
import Ryugu from './ryugu.js'
import Vesta from './vesta.js'
import Psyche from './psyche.js'
import Ceres from './ceres.js'

import Level1Scene from './level1.js'
import ConfirmationScene from './confirmationScene.js'
import GameOverScene from './gameOverScene.js'
import WinScene from './winScene.js'
import PauseScene from './pause.js'

import React, { useRef, Component } from 'react'
import Phaser from 'phaser'

class Game extends Component {
  game = null

  // function called after a game is mounted for setup
  componentDidMount() {
    // props passed down from react to determine which scene to load
    const { startingScene } = this.props

    let scenes = []
    // Conditionally load a different asteroid based on the URL endpoint
    switch (startingScene) {
      case 'Ryugu':
        scenes = [Ryugu, ConfirmationScene, GameOverScene, WinScene, PauseScene]
        break
      case 'Vesta':
        scenes = [Vesta, ConfirmationScene, GameOverScene, WinScene, PauseScene]
        break
      case 'Psyche':
        scenes = [
          Psyche,
          ConfirmationScene,
          GameOverScene,
          WinScene,
          PauseScene,
        ]
        break
      case 'Ceres':
        scenes = [Ceres, ConfirmationScene, GameOverScene, WinScene, PauseScene]
        break
      default:
        scenes = [GameOverScene] // default case
        break
    }

    // Prevents mouse right-click in game for more immersive game experience
    document.addEventListener(
      'contextmenu',
      function (event) {
        event.preventDefault()
      },
      false
    )

    // Phaser settings
    let config = {
      type: Phaser.AUTO,
      width: 1920 * 0.75,
      height: 1080 * 0.75,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 9.8 * 0.27 * 150 },
          debug: true,
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
      </div>
    )
  }
}

export default Game
