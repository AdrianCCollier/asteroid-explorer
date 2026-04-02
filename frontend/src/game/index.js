// Import different scenes
import Ryugu from './ryugu.js'
import Vesta from './vesta.js'
import Psyche from './psyche.js'
import Ceres from './ceres.js'

import GameOverScene from './gameOverScene.js'
import WinScene from './winScene.js'
import PauseScene from './pause.js'

import React, { Component } from 'react'
import Phaser from 'phaser'
import './game.css'

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
        scenes = [Ryugu, GameOverScene, WinScene, PauseScene]
        break
      case 'Vesta':
        scenes = [Vesta, GameOverScene, WinScene, PauseScene]
        break
      case 'Psyche':
        scenes = [Psyche, GameOverScene, WinScene, PauseScene]
        break
      case 'Ceres':
        scenes = [Ceres, GameOverScene, WinScene, PauseScene]
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
      parent: 'game-container',
      width: 1440,
      height: 810,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 9.8 * 0.27 * 150 },
          debug: false,
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
      <div id="game-container" className="gameContainer">
      </div>
    )
  }
}

export default Game
