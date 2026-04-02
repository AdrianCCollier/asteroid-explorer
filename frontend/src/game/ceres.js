import BaseLevel from './BaseLevel'
import mapJSON from './assets/Maps/Ceres.json'
import wallMapJSON from './assets/Maps/Ceres_Walls.json'
import themeSound from './assets/sounds/interstellar-space.mp3'

export default class Ceres extends BaseLevel {
  constructor() {
    super({
      key: 'Ceres',
      mapJSON,
      wallMapJSON,
      themeKey: 'ceresTheme',
      themeSound,
      themeVolume: 0.5,
      gravity: 9.8 * 0.27 * 150,
      playerSpawn: { x: 109, y: 2150 },
      bossSpawn: { x: 1900, y: 6500 },
      weaponSpawn: { x: 200, y: 470 },
    })
  }
}
