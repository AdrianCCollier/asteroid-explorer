import React from 'react'
import './StartButton.css'

const StartButton = ({onClick}) => {
  return (
    <button className='start-button' onClick={onClick}>Start Game</button>
  )
}

export default StartButton