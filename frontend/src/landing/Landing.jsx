import React, { useState, useEffect } from 'react'
import { Header } from '../containers'
import StartButton from './StartButton'
import Ticker from './components/Ticker'
import sound from './chiphead64-11pm.mp3'
import Background from './Background2.mp4'
import './landing.css'
import { useNavigate } from 'react-router'

function Landing() {

  const [audioStarted, setAudioStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (audioStarted) {
      const audio = new Audio(sound)
      audio.play();
    } 
  }, [audioStarted]);

  const startAudioAndNavigate = () => {
    setAudioStarted(true)
    navigate('/solarSystem')
  }
  return (
    <div className="landing">
      <video autoPlay loop muted className="gameplay-background">
        <source src={Background} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Header />
      <div className="centered-content">
        <StartButton onClick={startAudioAndNavigate} />
      </div>
      <Ticker></Ticker>
    </div>
  )
}

export default Landing
