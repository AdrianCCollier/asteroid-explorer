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

const API_KEY = process.env.API_KEY

const { connectToDatabase, db } = require('./database/database')

connectToDatabase();

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

//make GET request to browse endpoint, extract only 3 for now
app.get('/asteroids', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
    )
    const asteroids = response.data.near_earth_objects.slice(0, 3)
    res.json(asteroids) // now localhost:3000/asteroids will display their JSON
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send('Error occurred while fetching data from NASA API', error)
  }
})

// Catch-all route, will direct any invalid routes back to landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
