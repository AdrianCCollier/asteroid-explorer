import { Header, CanvasContainer } from './containers';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Game from './game/index';


// Style
import './Solar.css'
import './index.css'

function ExplorerGame(){
  return(
    <div>
      <Game />
    </div>
  );
}

function SolarSystem(){
  var asteroidData = null // Variable to hold the asteroid data

  // Fetch the asteroid data from backend/server.js when the component mounts
  fetch('http://localhost:3000/asteroids') // Fetch from link
    .then((response) => { // Then take response and return it in json form so it is usable
      return response.json()
    })
    .then((data) => { // Then take the json data returned and set it to variable
      console.log('Retrieved data is: ', data)
      asteroidData = data // Save the asteroid data in a variable
    })
    .catch((error) => console.error('Error fetching asteroids:', error))

  return (
    <div className="solar">
      <Header />
      <div className="solar__content__holder">
        <div className="solar__content-dynamic-canvas">
          <CanvasContainer />
        </div>
      </div>
    </div>
  )
}



function Solar() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/game" element = {<ExplorerGame />} />
          <Route index element = {<SolarSystem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Solar