import BaseLevel from './BaseLevel'
import mapJSON from './assets/Maps/Psyche.json'
import wallMapJSON from './assets/Maps/Psyche_Walls.json'
import themeSound from './assets/sounds/space-chillout.mp3'
import bossThemeSound from './assets/sounds/Static_Psyche_Boss.mp3'

export default class Psyche extends BaseLevel {
  constructor() {
    super({
      key: 'Psyche',
      mapJSON,
      wallMapJSON,
      themeKey: 'psycheTheme',
      themeSound,
      themeVolume: 0.3,
      bossThemeKey: 'psycheBossTheme',
      bossThemeSound,
      gravity: 9.8 * 0.06 * 400,
      playerSpawn: { x: 109, y: 1825 },
      bossSpawn: { x: 3070, y: 3700 },
      weaponSpawn: { x: 200, y: 470 },
    })
  }
}
