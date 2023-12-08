const express = require('express')
const router = express.Router()

// This is a custom data for our /api/custom-asteroids endpoint
const asteroidData = [
  {
    name: 'Ryugu',
    diameter: 896,
    distanceFromEarth: 0.42, 
  },
  {
    name: 'Vesta',
    diameter: 525400,
    distanceFromEarth: 1.88, 
  },
  {
    name: 'Psyche 16',
    diameter: 226000,
    distanceFromEarth: 3.91, 
  },
  {
    name: 'Ceres',
    diameter: 939400,
    distanceFromEarth: 3.69, 
  },
]

router.get('/custom-asteroids', (req, res) => {
  res.json(asteroidData)
})

module.exports = router
