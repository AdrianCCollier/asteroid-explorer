import React from 'react'
import './header.css'

// Component that creates the Asteroid Explorer Header in gradient text
const Header = () => {
  return (
    <div className="solarsystem__header section__padding">
      <div className="solarsystem__header-content section__padding">
        <h1 className="gradient__text">Asteroid Explorer</h1>
        <p className="solarsystem__header-subtitle">NAVIGATION SYSTEM &mdash; MISSION SELECT</p>
      </div>
    </div>
  )
}

export default Header
