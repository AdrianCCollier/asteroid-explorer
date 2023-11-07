const express = require('express')
const router = express.Router()

const asteroidData = [
  {
    name: 'Ryugu',
    diameter: 896,
    distanceFromEarth: 0.42, // AU
  },
  {
    name: 'Vesta',
    diameter: 525400,
    distanceFromEarth: 1.88, // AU
  },
  {
    name: 'Psyche 16',
    diameter: 226000,
    distanceFromEarth: 3.91, // AU
  },
  {
    name: 'Ceres',
    diameter: 939400,
    distanceFromEarth: 3.69, // AU
  },
]

router.get('/custom-asteroids', (req, res) => {
  res.json(asteroidData)
})

module.exports = router
