import { Header, CanvasContainer } from './containers'

// Style
import './Solar.css'
import './index.css'

function Solar() {
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

export default Solar