import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import drawAsteroids from '../system/asteroids.js'
import './canvas.css'

const ASTEROID_HIT_AREAS = [
  { x: 0.3,  y: 0.6,  radius: 256 / 15 / 2   },
  { x: 0.5,  y: 0.26, radius: 256 / 2.5 / 2  },
  { x: 0.6,  y: 0.35, radius: 256 / 2.75 / 2 },
  { x: 0.84, y: 0.52, radius: 256 / 1.8 / 2  },
]
const LEVEL_ROUTES = ['/level0', '/level1', '/level2', '/level3']
const DIFFICULTIES = [1, 2, 3, 4]

function CanvasContainer({ asteroids }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const cancelAnimRef = useRef(null)
  const mapStateRef = useRef({
    hoveredIndex: null,
    bossKills: parseInt(localStorage.getItem('bossKills')) || 0,
  })

  const [missionBrief, setMissionBrief] = useState(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const resizeCanvas = () => {
      if (cancelAnimRef.current) {
        cancelAnimRef.current()
        cancelAnimRef.current = null
      }

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      context.clearRect(0, 0, canvas.width, canvas.height)

      drawAsteroids(context, canvas.height, canvas.width, mapStateRef).then(cancel => {
        cancelAnimRef.current = cancel
      })
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const handleClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const w = canvasRef.current.width
      const h = canvasRef.current.height

      let hit = false
      for (let i = 0; i < ASTEROID_HIT_AREAS.length; i++) {
        const { x, y, radius } = ASTEROID_HIT_AREAS[i]
        const dx = mx - w * x
        const dy = my - h * y
        if (Math.sqrt(dx * dx + dy * dy) < radius) {
          if (i > mapStateRef.current.bossKills) break // locked
          setMissionBrief({
            index: i,
            name: asteroids?.[i]?.name ?? ['Ryugu', 'Vesta', 'Psyche', 'Ceres'][i],
            diameter: asteroids?.[i]?.diameter ?? '—',
            distanceFromEarth: asteroids?.[i]?.distanceFromEarth ?? '—',
            difficulty: DIFFICULTIES[i],
            levelRoute: LEVEL_ROUTES[i],
          })
          hit = true
          break
        }
      }
      if (!hit) setMissionBrief(null)
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('resize', resizeCanvas)
      if (cancelAnimRef.current) {
        cancelAnimRef.current()
        cancelAnimRef.current = null
      }
    }
  }, [asteroids])

  // Mousemove — writes to ref, no re-render (fixed: now has cleanup)
  useEffect(() => {
    const canvas = canvasRef.current

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const w = canvas.width
      const h = canvas.height

      let hit = null
      ASTEROID_HIT_AREAS.forEach(({ x, y, radius }, i) => {
        const dx = mx - w * x
        const dy = my - h * y
        if (Math.sqrt(dx * dx + dy * dy) < radius) hit = i
      })

      canvas.style.cursor = hit !== null ? 'pointer' : 'default'
      mapStateRef.current.hoveredIndex = hit
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    return () => canvas.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="frontend__containers__canvas">
      <canvas id="frontend__containers__canvas__init" ref={canvasRef}></canvas>

      {missionBrief && (
        <div className="mission-brief-panel">
          <button className="mission-brief-close" onClick={() => setMissionBrief(null)}>✕</button>
          <div className="mission-brief-zone">MISSION {missionBrief.index + 1}</div>
          <div className="mission-brief-title">{missionBrief.name}</div>
          <div className="mission-brief-stats">
            <span>Diameter: {missionBrief.diameter} m</span>
            <span>Distance: {missionBrief.distanceFromEarth} AU</span>
          </div>
          <div className="mission-brief-difficulty">
            {'★'.repeat(missionBrief.difficulty)}{'☆'.repeat(4 - missionBrief.difficulty)}
          </div>
          <button className="mission-brief-launch" onClick={() => navigate(missionBrief.levelRoute)}>
            LAUNCH MISSION
          </button>
        </div>
      )}
    </div>
  )
}

export default CanvasContainer
