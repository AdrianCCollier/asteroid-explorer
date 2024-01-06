import React, { useState, useEffect } from 'react'
import './TickerTape.css' 

const TickerTape = ({ text = "Default Text", speed = 50 }) => {
  // rest of your code

  const [position, setPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) =>
        prevPosition > -100 ? prevPosition - 1 : 100
      )
    }, speed)

    return () => clearInterval(interval)
  }, [speed])

  return (
    <div className="ticker-tape-container">
      <span style={{ left: `${position}%` }}>{'Creators: Andrew Melo, Malyk Banka, Alex Flores, Adrian Collier'}</span>
    </div>
  )
}

export default TickerTape
