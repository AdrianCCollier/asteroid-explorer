import { Header, CanvasContainer } from './containers';

import QuickView from './containers/quickView/QuickView';

import Earth from './containers/canvas/Earth.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Game from './game/index';

import Landing from './landing/Landing.jsx'
import Signin from './landing/Signin.jsx'

import React, { useEffect, useState } from 'react'

// Style
import './Solar.css'
import './index.css'


function ExplorerGame0() {
  return (
    <div>
      <Game startingScene="Ryugu"  />
    </div>
  )
}

function ExplorerGame1() {
  return (
    <div>
      <Game startingScene="Vesta" />
    </div>
  )
}

function ExplorerGame2() {
  return (
    <div>
      <Game startingScene="Psyche" />
    </div>
  )
}

function ExplorerGame3() {
  return (
    <div>
      <Game startingScene="Ceres" />
    </div>
  )
}

function SolarSystem(){

  const [asteroidData, setAsteroidData] = useState(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState( true );

  console.log('yooooo inside main menu')

  // effect to fetch asteroid data
  // need to store it in local storage
  useEffect( () => {
    
    // Fetch the asteroid data from backend/server.js when the component mounts
    // fetch('http://localhost:3000/asteroids') // Fetch from link
    fetch('http://localhost:3000/api/custom-asteroids') // Fetch from link
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
  
  }, []);


  // effect to show welcome screen for two seconds
  // will be deleted after landing page is implemented
  useEffect( () => {
    const timer = setTimeout( () => {
      setShowWelcomeScreen(false);
    }, 0);

    return () => clearTimeout( timer );
  }, []);



  return (
    <div className="solar"> 
      <Header />

      { showWelcomeScreen ? (
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

        <QuickView />

      </div>
      )}
    </div>
  )
}



function Solar() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/level0" element={<ExplorerGame0 />} />

          <Route path="/level1" element={<ExplorerGame1 />} />

          <Route path="/level2" element={<ExplorerGame2 />} />

          <Route path="/level3" element={<ExplorerGame3 />} />

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