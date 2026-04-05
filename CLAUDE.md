# Asteroid Explorer — Project Context

## Stack

| Layer | Tech | Port |
|---|---|---|
| Frontend | React (Create React App) | 3001 |
| Game engine | Phaser 3 (arcade physics) | — |
| Backend | Express + nodemon | 3000 |
| Database | MongoDB | — |

## Dev Commands

```bash
# Start everything (frontend + backend + game server)
npm run start-all        # from project root

# Frontend only
cd frontend && npm start  # SET PORT=3001 (Windows)

# Backend only
cd backend && npm start   # nodemon server.js
```

**Windows note:** the frontend start script uses `SET PORT=3001 &&` (Windows env syntax). Do not change this to `PORT=3001` or it will break on this machine.

## Routes

| Path | Component |
|---|---|
| `/landing` | Landing / sign-in page |
| `/solarSystem` | Solar system view (asteroid picker) — React canvas, NOT Phaser |
| `/level0` | Ryugu (Level 1) |
| `/level1` | Vesta (Level 2) |
| `/level2` | Psyche (Level 3) |
| `/level3` | Ceres (Level 4) |

## Key Files

```
frontend/src/
  App.js                     React Router — all route definitions
  index.js                   React entry point
  game/
    index.js                 React component that mounts Phaser.Game (componentDidMount)
    BaseLevel.js             Base class for ALL level scenes — shared preload/create/update
    ryugu.js                 Level 0 — extends BaseLevel
    vesta.js                 Level 1 — extends BaseLevel
    psyche.js                Level 2 — extends BaseLevel
    ceres.js                 Level 3 — extends BaseLevel
    player.js                Player sprite logic (functions, not a class)
    enemy.js                 Enemy management
    bullet.js                Projectile logic
    animation.js             Phaser animation definitions
    health.js                Health/shield bar HUD
    ControlsOverlay.js       In-game UI overlay (screen-space HUD)
    ScoreSystem.js           Score tracking
    gameOverScene.js         Game-over screen
    winScene.js              Win screen
    assets/
      Maps/                  Tiled JSON map files + tilesets
      sounds/                Audio files (MP3)
  containers/
    canvas/canvas.js         Solar system 2D canvas (requestAnimationFrame loop, NOT Phaser)
    header/Header.jsx        Nav header
```

## Level Pattern

Every level is a thin subclass of `BaseLevel`. Do not override `preload`, `create`, or `update` — those live in BaseLevel and are inherited.

```js
import BaseLevel from './BaseLevel'
import mapJSON from './assets/Maps/LevelName.json'
import wallMapJSON from './assets/Maps/LevelName_Walls.json'
import themeSound from './assets/sounds/theme.mp3'

export default class LevelName extends BaseLevel {
  constructor() {
    super({
      key: 'LevelName',           // Phaser scene key (string)
      mapJSON,                    // Tiled JSON floor map
      wallMapJSON,                // Tiled JSON wall map
      themeKey: 'levelNameTheme', // Unique audio cache key
      themeSound,                 // Imported audio file
      themeVolume: 1,             // 0–1
      gravity: 9.8 * 0.27 * 150, // Physics world gravity
      playerSpawn: { x: 0, y: 0 },
      bossSpawn: { x: 0, y: 0 },
      weaponSpawn: { x: 0, y: 0 },
      // Optional:
      // bossThemeKey, bossThemeSound
    })
  }
}
```

Register the new scene in `frontend/src/game/index.js` by adding it to the relevant switch-case.

## React ↔ Phaser Integration

- `App.js` uses React Router to switch between pages
- Level routes render `<ExplorerGame startingScene="Ryugu" />` (the `Game` component in `game/index.js`)
- `Game.componentDidMount()` creates `new Phaser.Game(config)` with the correct scene list based on `startingScene`
- `Game.componentWillUnmount()` calls `this.game.destroy(true)`
- The solar system page (`/solarSystem`) uses a plain `<canvas>` with `requestAnimationFrame` — **not Phaser**

## MCP Tools Available

After running `npm install` in `mcp-server/` and restarting Claude Code:

- **`run_build`** — runs `npm run build` in `frontend/`, returns errors
- **`validate_scene(filepath)`** — checks a level file follows the BaseLevel pattern
- **Playwright MCP** (`@playwright/mcp`) — screenshot, navigate, check console errors in browser

## ESLint

React App defaults only (`react-app` preset). No Prettier, no custom rules. Warnings do not fail the build locally (CI=false is set in the MCP build tool).
