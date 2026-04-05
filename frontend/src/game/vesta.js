import BaseLevel from './BaseLevel'
import mapJSON from './assets/Maps/Vesta.json'
import wallMapJSON from './assets/Maps/Vesta_Walls.json'
import themeSound from './assets/sounds/appulse.mp3'
import bossThemeSound from './assets/sounds/Static_Vesta_boss.mp3'

export default class Vesta extends BaseLevel {
  constructor() {
    super({
      key: 'Vesta',
      mapJSON,
      wallMapJSON,
      themeKey: 'vestaTheme',
      themeSound,
      themeVolume: 0.5,
      bossThemeKey: 'vestaBossTheme',
      bossThemeSound,
      gravity: 9.8 * 0.22 * 125,
      playerSpawn: { x: 109, y: 4580 },
      bossSpawn: { x: 3712, y: 5800 },
      weaponSpawn: { x: 200, y: 470 },
    })
  }
}
