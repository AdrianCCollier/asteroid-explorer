import { Header, CanvasContainer } from './containers'
// import QuickView from './containers/quickView/QuickView'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Game from './game/index'
import Landing from './landing/Landing.jsx'
import Signin from './landing/Signin.jsx'
import React, { useEffect, useState, useRef } from 'react'
import themeSound from './11pm.mp3'

// Styling sheet imports
import './App.css'
import './index.css'

// Cutscene to be played the first time only
// import cutscene from './Intro.mp4'

// import { useNavigate } from 'react-router-dom'

function ExplorerGame({ startingScene }) {
  return (
    <div>
      <Game startingScene ={startingScene} />
    </div>
  )
}

function SolarSystem() {
  const [asteroidData, setAsteroidData] = useState(null)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(new Audio(themeSound))

  useEffect(() => {

    audioRef.current.loop = true
    audioRef.current.volume = 0.5

    const playAudio = async () => {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.log('Audio playback failed: ', error)
      }
    }
    playAudio()

    // Clean up: Stop audio when leaving solarSystem view
    return () => {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

    useEffect(() => {

 
    // Fetch the asteroid data from backend/server.js when the component mounts
    fetch('http://localhost:3000/api/custom-asteroids') // Fetch from link
    // fetch('https://asteroidexplorer.com/api/custom-asteroids') // AWS deployment endpoint
      .then((response) => {
        // Then take response and return it in json form so it is usable
        return response.json()
      })
      .then((data) => {
        // Then take the json data returned and set it to variable
        console.log('Made an API call! Retrieved data inside solar is: ', data)
        setAsteroidData(data) // Save the asteroid data in a variable
      })
      .catch((error) => console.error('Error fetching asteroids:', error))
  }, [])

  // effect to show welcome screen for two seconds
  // will be deleted after landing page is implemented
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeScreen(false)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="solar">
      <Header />

      {showWelcomeScreen ? (
        <div className="solar__content-welcome">
          <h1>Welcome to Asteroid Explorer!</h1>
        </div>
      ) : (
        <div className="">
          <div className="solar__content__holder">
            <div className="solar__content-dynamic-canvas">
              <CanvasContainer asteroids={asteroidData} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  // Conditionally render a different Phaser scene, based on the route path, to create a multi-leveling system
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/level0"
            element={<ExplorerGame startingScene="Ryugu" />}
          />
          <Route
            path="/level1"
            element={<ExplorerGame startingScene="Vesta" />}
          />
          <Route
            path="/level2"
            element={<ExplorerGame startingScene="Psyche" />}
          />
          <Route
            path="/level3"
            element={<ExplorerGame startingScene="Ceres" />}
          />

          <Route path="/landing" element={<Landing />} />
          <Route path="/solarSystem" element={<SolarSystem />} />
          <Route path="/signin" element={<Signin />} />
          <Route index element={<Landing />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
