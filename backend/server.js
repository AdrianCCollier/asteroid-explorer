const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, '../frontend/build')))
app.use(express.json())

const asteroidRouter = require('./routes/customAsteroids')
const fs = require('fs')

const API_KEY = process.env.API_KEY
const CACHE_DURATION = 744 * 3600 * 1000 // Data is cached for a month
const CACHE_FILE = path.join(__dirname, 'asteroidsCache.json')

const { connectToDatabase, db } = require('./database/database')

connectToDatabase()

// addPlayer POST route, for future use
app.post('/addPlayer', async (req, res) => {
  const newPlayer = {
    name: req.body.name,
    level: req.body.level,
  }

  try {
    const database = await connectToDatabase()
    const playerCollection = database.collection('players')
    const result = await playerCollection.insertOne(newPlayer)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error occurred while inserting data', error)
  }
})

app.use('/api', asteroidRouter);

// app.get('/asteroids', (req, res) => {
//   // Check if cache file exists
//   if (fs.existsSync(CACHE_FILE)) {
//     const cachedDataRaw = fs.readFileSync(CACHE_FILE, 'utf-8')
//     const cachedData = JSON.parse(cachedDataRaw)

//     const currentTime = new Date().getTime()

//     // If cache is still fresh, return the cached data
//     if (currentTime - cachedData.timestamp <= CACHE_DURATION) {
//       return res.json(cachedData.asteroids)
//     }
//   }

//   // If cache is not available or stale, fetch from API
//   axios
//     .get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`)
//     .then((response) => {
//       const asteroids = response.data.near_earth_objects.slice(0, 4)

//       // Write to cache file
//       const dataToCache = {
//         timestamp: new Date().getTime(),
//         asteroids: asteroids,
//       }

//       fs.writeFileSync(CACHE_FILE, JSON.stringify(dataToCache))

//       res.json(asteroids)
//     })
//     .catch((error) => {
//       console.log(error)
//       res
//         .status(500)
//         .send('Error occurred while fetching data from NASA API', error)
//     })
// })

// Catch-all route, will direct any invalid routes back to landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
