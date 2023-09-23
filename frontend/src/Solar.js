import React, {useEffect, useState} from 'react';
import './Solar.css';
import './index.css';
import { Header, CanvasContainer, Menu } from './containers';
import drawAsteroids from './containers/system/asteroids';  // Import the drawAsteroids function


function Solar() {
  // This is our state to hold our asteroid data, 'asteroids' displays the data, and 'setAsteroids' adds it.
  const [asteroids, setAsteroids] = useState([])

  useEffect(() => {

    // Get asteroid data from backend, server.js has an /asteroids route
    fetch('http://localhost:3000/asteroids')
      .then((response) => {
        if (!response.ok) {
          // check if response worked, throw error if not
          throw Error(response.statusText)
        }
        // console log it, and also return it
        console.log(response.status)
        return response.json()
      })
      .then((data) => {
        console.log('Now the body of my response is: ', data) 
        setAsteroids(data) // Store our asteroid state with API data
        // drawAsteroids(data) // Call the drawAsteroids function with the data
      })
      .catch((error) => console.error('Error fetching asteroids:', error))
  }, []) // Empty dependency array means this useEffect runs once, similar to componentDidMount

  return (
    <div className="solar">
      <Header />
      <div className="solar__content">
        <CanvasContainer asteroids={asteroids} />
        <Menu />
      </div>
    </div>
  )
}

export default Solar;
