import React, { useEffect, useState } from 'react'
import './Solar.css'
import './index.css'
import { Header, CanvasContainer } from './containers'
import drawAsteroids from './containers/system/Asteroids.jsx' // Import the drawAsteroids function

function Solar() {
  const [asteroids, setAsteroids] = useState([]) // State to hold the asteroid data

  useEffect(() => {
    // Fetch the asteroid data from backend/server.js when the component mounts
    fetch('http://localhost:3000/asteroids')
      .then((response) => {
        console.log('Response Status:', response.status) // log status
        return response.json()
      })
      .then((data) => {
        console.log('Retrieved data is: ', data)
        setAsteroids(data) // Save the asteroid data in the state
      })
      .catch((error) => console.error('Error fetching asteroids:', error))
  }, []) // Empty dependency array means this useEffect runs once, similar to componentDidMount

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

export default Solar
