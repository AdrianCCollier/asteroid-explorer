import React, { useState } from 'react'
import { Button } from 'antd'
import './inventory.css'

const Inventory = () => {
  const [selectedButton, setSelectedButton] = useState(null)

  const [upgradeMessage, setUpgradeMessage] = useState('')

  const [playerPoints, setPlayerPoints] = useState(
    parseInt(localStorage.getItem('playerPoints')) || 0
  )

  const [pistolLevel, setPistolLevel] = useState(
    parseInt(localStorage.getItem('pistolLevel')) || 1
  )

  const [pistolLevelCost, setPistolLevelCost] = useState(
    parseInt(localStorage.getItem('pistolLevelCost')) || 1500
  )

  const [arLevel, setArLevel] = useState(
    parseInt(localStorage.getItem('arLevel')) || 1
  )

  const [arLevelCost, setArLevelCost] = useState(
    parseInt(localStorage.getItem('arLevelCost')) || 1500
  )

  const [shotgunLevel, setShotgunLevel] = useState(
    parseInt(localStorage.getItem('shotgunLevel')) || 1
  )

  const [shotgunLevelCost, setShotgunLevelCost] = useState(
    parseInt(localStorage.getItem('shotgunLevelCost')) || 1500
  )

  console.log(JSON.parse(localStorage.getItem('pistol')))

  var upgradeCost = 0

  const updatePistolLevel = () => {
    const updatedPistolLevel = pistolLevel + 1
    setPistolLevel(updatedPistolLevel)
    // localStorage.setItem('pistolLevel', pistolLevel.toString())
    localStorage.setItem('pistolLevel', updatedPistolLevel.toString()) // Update this line
  } // end updatePistolLevel function

  const updatePistolLevelCost = () => {
    const updatedPistolLevelCost = pistolLevelCost + 500
    setPistolLevelCost(updatedPistolLevelCost)
    localStorage.setItem('pistolLevelCost', pistolLevelCost.toString())
  }

  const updateArLevel = () => {
    const updatedArLevel = arLevel + 1
    setArLevel(updatedArLevel)
    localStorage.setItem('arLevel', updatedArLevel.toString())
  } // end updateArLevel function

  const updateArLevelCost = () => {
    const updatedArLevelCost = arLevelCost + 500
    setArLevelCost(updatedArLevelCost)
    localStorage.setItem('arLevelCost', arLevelCost.toString())
  }

  const updateShotgunLevel = () => {
    const updatedShotgunLevel = shotgunLevel + 1
    setShotgunLevel(updatedShotgunLevel)
    localStorage.setItem('shotgunLevel', updatedShotgunLevel.toString())
  } // end updateShotgunLevel function

  const updateShotgunLevelCost = () => {
    const updatedShotgunLevelCost = shotgunLevelCost + 500
    setShotgunLevelCost(updatedShotgunLevelCost)
    localStorage.setItem('shotgunLevelCost', shotgunLevelCost.toString())
  }

  const updatePlayerPoints = (upgradeCost) => {
    const updatedPoints = playerPoints - upgradeCost
    setPlayerPoints(updatedPoints)
    localStorage.setItem('playerPoints', updatedPoints.toString())
  } // end updatePlayerPoints function

  const handlePistolUpgrade = () => {
    if (playerPoints >= pistolLevelCost) {
      upgradeCost = pistolLevelCost
      updatePlayerPoints(upgradeCost)
      updatePistolLevel()
      updatePistolLevelCost()

      setUpgradeMessage('Upgraded: Rate of Fire')
      setTimeout(() => setUpgradeMessage(''), 3000)
    } // end if
    else return
  } // end handlePistolUpgrade function

  const handleItemClick = (buttonName) => {
    setSelectedButton(buttonName)
  }

  const handleArUpgrade = () => {
    if (playerPoints >= arLevelCost) {
      upgradeCost = arLevelCost
      updatePlayerPoints(upgradeCost)
      updateArLevel()
      updateArLevelCost()
      setUpgradeMessage('Upgraded: Rate of Fire')
      setTimeout(() => setUpgradeMessage(''), 3000)
    } // end if
    else return
  } // end handleArUpgrade function

  const handleShotgunUpgrade = () => {
    if (playerPoints >= shotgunLevelCost) {
      upgradeCost = shotgunLevelCost
      updatePlayerPoints(upgradeCost)
      updateShotgunLevel()
      updateShotgunLevelCost()
      setUpgradeMessage('Upgraded: Increased Accuracy')
      setTimeout(() => setUpgradeMessage(''), 3000)
    } // end if
    else return
  } // end handleShotgunUpgrade function

  // NEW FUNCTIONS

  // Function to add 1000 points
  const addPoints = () => {
    const newPoints = playerPoints + 1000
    setPlayerPoints(newPoints)
    localStorage.setItem('playerPoints', newPoints.toString())
  }

  // Function to subtract 1000 points
  const subtractPoints = () => {
    // Ensure that points do not go below zero
    const newPoints = Math.max(0, playerPoints - 1000)
    setPlayerPoints(newPoints)
    localStorage.setItem('playerPoints', newPoints.toString())
  }

  // This function is used to dynamically change the upgrade button from gray to green
  // based on the player's available points, visually see what you can buy
  const getButtonClass = (upgradeCost) => {
    // If the player does not have enough points, return the disabled upgrade class
    if (playerPoints < upgradeCost) {
      return 'upgrade disabled-upgrade'
    }
    // Otherwise, return the regular upgrade class
    return 'upgrade'
  }

  return (
    <div className="inventory-menu">
      <div
        className="menu"
        style={{
          width: window.innerWidth * 0.76,
          height: window.innerHeight * 0.78,
        }}
      >
        <h1 className="gradient__text">Inventory</h1>
        <h2>Current Δ : {playerPoints}</h2>
        <ul>
          <Button className="item">Pistol</Button>
          <Button className="item">AR</Button>
          <h3>
            LVL: {pistolLevel} Δ{pistolLevelCost}
          </h3>
          <h3>
            LVL: {arLevel} Δ{arLevelCost}
          </h3>

          {/* upgrade button one */}
          <Button
            className={getButtonClass(pistolLevelCost)}
            onClick={handlePistolUpgrade}
            disabled={playerPoints < pistolLevelCost}
          >
            UPGRADE
          </Button>

          {/* upgrade button two */}
          <Button
            className={getButtonClass(arLevelCost)}
            onClick={handleArUpgrade}
            disabled={playerPoints < arLevelCost}
          >
            UPGRADE
          </Button>

          <Button className="item">Shotgun</Button>
          <Button className="item">?</Button>
          <h3>
            LVL: {shotgunLevel} Δ{shotgunLevelCost}
          </h3>
          <h3>LVL: 1 Δ0</h3>
          {/* upgrade button three */}
          <Button
            className={getButtonClass(shotgunLevelCost)}
            onClick={handleShotgunUpgrade}
            disabled={playerPoints < shotgunLevelCost}
          >
            UPGRADE
          </Button>
          <Button className="disabled-upgrade">UPGRADE</Button>
        </ul>
        <Button onClick={addPoints}>Add 1000 Points</Button>
        <Button onClick={subtractPoints}>Subtract 1000 Points</Button>

        {/* Upgrade Message */}
        {upgradeMessage && (
          <div className="upgrade-message">{upgradeMessage}</div>
        )}
      </div>
    </div>
  )
}

export default Inventory