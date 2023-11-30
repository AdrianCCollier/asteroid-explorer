import React, { useState, useEffect } from 'react'
import { Form, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Header } from '../containers'
import sound from './chiphead64-11pm.mp3'

// Handling account registration logic
import axios from 'axios'

import './landing.css'

function Landing() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [audioStarted, setAudioStarted] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    // handle password mismatch
    if (password !== confirmPassword) {
      return
    }
    try {
      const response = await axios.post('/api/register', { username, password })
    } catch (error) {
      console.log('inside catch statement in Landing.jsx, ran into an issue')
    }
  }

  useEffect(() => {
    if (audioStarted) {
      const audio = new Audio(sound)
      audio.play()
    } // end if
  }, [audioStarted])

  const startAudio = () => {
    setAudioStarted(true)
  }

  console.log('Inside landing')
  return (
    <div className="landing">
      <Header />
      <div className="body">
        <Form autoComplete="off" className="form" onSubmit={handleRegister}>
          <p className="title">Register</p>
          <div className="form-group">
            <label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span>Username</span>
            </label>
            <label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span>Password</span>
            </label>
            <label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span>Confirm Password</span>
            </label>
          </div>

          <Button type="submit" className="submit" onClick={startAudio}>
              Submit
            </Button>

          <p className="signin">
            Already have an account?
            <a href="/signIn"> Sign in</a>
          </p>
          <div className="signin">
            <Link to="/solarSystem">
              <div className="tooltip-container">
                <Button className="submit">Quick Play</Button>
                <div className="tooltip">Progress Will Be Stored Locally</div>
              </div>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Landing
