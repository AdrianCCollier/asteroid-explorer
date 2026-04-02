import BaseLevel from './BaseLevel'
import mapJSON from './assets/Maps/Ryugu.json'
import wallMapJSON from './assets/Maps/Ryugu_Walls.json'
import themeSound from './assets/sounds/11pm.mp3'

export default class Ryugu extends BaseLevel {
  constructor() {
    super({
      key: 'Ryugu',
      mapJSON,
      wallMapJSON,
      themeKey: 'ryuguTheme',
      themeSound,
      themeVolume: 1,
      gravity: 9.8 * 0.0011 * 25000,
      playerSpawn: { x: 109, y: 3520 },
      bossSpawn: { x: 1315, y: 2200 },
      weaponSpawn: { x: 200, y: 470 },
    })
  }
}
