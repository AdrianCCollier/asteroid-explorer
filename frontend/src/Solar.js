import { Header, CanvasContainer } from './containers'
import QuickView from './containers/quickView/QuickView'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Game from './game/index'
import Landing from './landing/Landing.jsx'
import Signin from './landing/Signin.jsx'
import React, { useEffect, useState, useRef } from 'react'

// Styling sheet imports
import './Solar.css'
import './index.css'

// Cutscene to be played the first time only 
import cutscene from './Intro.mp4'

import { useNavigate } from 'react-router-dom'

// Return the Ryugu level, which will be linked to /level0
function ExplorerGame0() {
  return (
    <div>
      <Game startingScene="Ryugu" />
    </div>
  )
}
// Return the Vesta level, which will be linked to /level1

function ExplorerGame1() {
  return (
    <div>
      <Game startingScene="Vesta" />
    </div>
  )
}

// Return the Psyche level, which will be linked to level2

function ExplorerGame2() {
  return (
    <div>
      <Game startingScene="Psyche" />
    </div>
  )
}

// Return the Ceres level, which will be linked to level3

function ExplorerGame3() {
  return (
    <div>
      <Game startingScene="Ceres" />
    </div>
  )
}

function Intro() {
  const videoRef = useRef(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const navigate = useNavigate()

  localStorage.setItem('intro', JSON.stringify(true))

  const handleVideoEnd = () => {
    console.log('ended')
    setVideoEnded(true)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // After 500 milliseconds (1 second), unmute the video
      if (videoRef.current) {
        videoRef.current.muted = false
      }
    }, 500)

    // Clear the timeout if the component unmounts before the delay
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (videoEnded) {
      // Navigate to /solarSystem when video ends
      navigate('/solarSystem')
    }
  }, [videoEnded, navigate])

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <video
        ref={videoRef}
        src={cutscene}
        autoPlay
        muted
        onEnded={handleVideoEnd}
        style={{
          width: '80%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  )
}

function SolarSystem() {
  const [asteroidData, setAsteroidData] = useState(null)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)

  // effect to fetch asteroid data
  // need to store it in local storage
  useEffect(() => {
    // Fetch the asteroid data from backend/server.js when the component mounts
    fetch('http://localhost:3000/api/custom-asteroids') // Fetch from link
    // fetch('https://asteroidexplorer.com/api/custom-asteroids') // Fetch from link
      .then((response) => {
        // Then take response and return it in json form so it is usable
        return response.json()
      })
      .then((data) => {
        // Then take the json data returned and set it to variable
        console.log('YOO Retrieved data inside solar is: ', data)
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

          {/* <QuickView /> */}
        </div>
      )}
    </div>
  )
}

function Solar() {

  
  // Conditionally render a different Phaser scene, based on the route path, to create a multi-leveling system
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/level0" element={<ExplorerGame0 />} />

          <Route path="/level1" element={<ExplorerGame1 />} />

          <Route path="/level2" element={<ExplorerGame2 />} />

          <Route path="/level3" element={<ExplorerGame3 />} />

          <Route path="/intro" element={<Intro />} />

          <Route path="/landing" element={<Landing />} />
          <Route path="/solarSystem" element={<SolarSystem />} />
          <Route path="/signin" element={<Signin />} />
          <Route index element={<Landing />} />
        </Routes>
      </div>
    </Router>
  )
}

export default Solar
