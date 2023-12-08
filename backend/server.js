// Import libraries and dependancies 
const express = require('express')
const axios = require('axios')
// To salt and hash passwords
const bcrypt = require('bcrypt')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const cors = require('cors')

// To safely store API and database credentials inside .env file, use by reference
require('dotenv').config()
const mongoose = require('mongoose')

// Allow PORT 3000 and 3001 data flow
app.use(cors())

// Point to React's public folder
app.use(express.static('public'))

// AWS LightSail Production path
// app.use(express.static('/home/bitnami/htdocs'))

// Local development path
app.use(express.static(path.join(__dirname, '../frontend/build')))

app.use(express.json())

// Import the User model from models/User.js, for account creation
const User = require('./models/User'); 
const asteroidRouter = require('./routes/customAsteroids')
const fs = require('fs')

// Reference API_KEY by reference
const API_KEY = process.env.API_KEY

// NASA API calls are only made first time, or once a month, this timer determines that
const CACHE_DURATION = 744 * 3600 * 1000 // Data is cached for a month
const CACHE_FILE = path.join(__dirname, 'asteroidsCache.json')

// Import database/database.js, which encapsulates database connection code
const { connectToDatabase, db } = require('./database/database')

connectToDatabase()

// Testing only, get list of current users
app.get('/users', (req, res) => {
  res.json(users)
})

// Account creation, submits username, along with salted/hashed password
app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({username: req.body.name, password: hashedPassword });
    await user.save();

    res.status(201).send('User created successfully')
  } catch(error) {
    console.error('Error creating user:', error)
    res.status(500).send('Error occurred while creating user');
  }
})

// If credentials exist, redirect to homepage
app.post('/users/login', async(req, res) => {
  const user = users.find(user => user.name = req.body.name)
  
  if(user == null) {
    return res.status(400).send('No User Found')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed');
    }
  } catch{
    res.status(500).send()
  }
})

// Alternative register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const database = await connectToDatabase()
    const testCollection = database.collection('testCollection')

    const { username, password } = req.body
    console.log('Request body:', req.body)

    const User = mongoose.model(
      'User',
      new mongoose.Schema({ username: String, password: String })
    )
    const newUser = new User({ username, password })
    await newUser.save()
    console.log('User registered successfully')
    res.status(201).send('User registered successfully')
  } catch (error) {
    console.error('Registration error: ', error)
    res.status(500).send('Error occurred during registration :(')
  }
})

// route for custom asteroids, /api/custom-asteroids
app.use('/api', asteroidRouter)


app.get('/asteroids', (req, res) => {
  // Check if cache file exists
  if (fs.existsSync(CACHE_FILE)) {
    const cachedDataRaw = fs.readFileSync(CACHE_FILE, 'utf-8')
    const cachedData = JSON.parse(cachedDataRaw)

    const currentTime = new Date().getTime()

    // If cache is still fresh, return the cached data
    if (currentTime - cachedData.timestamp <= CACHE_DURATION) {
      return res.json(cachedData.asteroids)
    }
  }

  // If cache is not available or stale, fetch from API
  axios
    .get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`)
    .then((response) => {
      const asteroids = response.data.near_earth_objects.slice(0, 4)

      // Write to cache file
      const dataToCache = {
        timestamp: new Date().getTime(),
        asteroids: asteroids,
      }

      fs.writeFileSync(CACHE_FILE, JSON.stringify(dataToCache))

      res.json(asteroids)
    })
    .catch((error) => {
      console.log(error)
      res
        .status(500)
        .send('Error occurred while fetching data from NASA API', error)
    })
})

// Catch-all route, will direct any invalid routes back to landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

// Listen on PORT 3000
app.listen(port, () => console.log(`Server listening on port ${port}`))
