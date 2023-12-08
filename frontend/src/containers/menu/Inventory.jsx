import React, { useState } from 'react'
import { Button } from 'antd'
import './inventory.css'

// This function is responsible for our Game Inventory, it allows players to view their current points, weapons, and upgrades
const Inventory = () => {
  // Set null and empty states initially
  const [selectedButton, setSelectedButton] = useState(null)

  const [upgradeMessage, setUpgradeMessage] = useState('')

  // For this and all below, attempt to fetch data from local storage, if not found, set default values
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

  // Function to update our pistol level
  // Player must have enough points to call this function
  // It increases the pistol level, which is used dynamically within Phaser to upgrade our weapon
  const updatePistolLevel = () => {
    const updatedPistolLevel = pistolLevel + 1
    setPistolLevel(updatedPistolLevel)
    localStorage.setItem('pistolLevel', updatedPistolLevel.toString())
  } // end updatePistolLevel function

  // Function to increase the pistol cost
  // This function is called once an upgrade has been made
  // Ensuring that the next upgrade is more expensive
  const updatePistolLevelCost = () => {
    const updatedPistolLevelCost = pistolLevelCost + 500
    setPistolLevelCost(updatedPistolLevelCost)
    localStorage.setItem('pistolLevelCost', pistolLevelCost.toString())
  }

  // Same logic
  const updateArLevel = () => {
    const updatedArLevel = arLevel + 1
    setArLevel(updatedArLevel)
    localStorage.setItem('arLevel', updatedArLevel.toString())
  } // end updateArLevel function

  // Same logic
  const updateArLevelCost = () => {
    const updatedArLevelCost = arLevelCost + 500
    setArLevelCost(updatedArLevelCost)
    localStorage.setItem('arLevelCost', arLevelCost.toString())
  }

  // Same logic 
  const updateShotgunLevel = () => {
    const updatedShotgunLevel = shotgunLevel + 1
    setShotgunLevel(updatedShotgunLevel)
    localStorage.setItem('shotgunLevel', updatedShotgunLevel.toString())
  } // end updateShotgunLevel function

  // Same logic
  const updateShotgunLevelCost = () => {
    const updatedShotgunLevelCost = shotgunLevelCost + 500
    setShotgunLevelCost(updatedShotgunLevelCost)
    localStorage.setItem('shotgunLevelCost', shotgunLevelCost.toString())
  }
  
  // This function is called once an upgrade has been made. It reduces the player points by the upgrade cost and updates local storage 
  const updatePlayerPoints = (upgradeCost) => {
    const updatedPoints = playerPoints - upgradeCost
    setPlayerPoints(updatedPoints)
    localStorage.setItem('playerPoints', updatedPoints.toString())
  } // end updatePlayerPoints function

  // This function uses the above functions to upgrade the player's weapon.
  // Once enough points have been accumulated, the upgrade cost is updated, along with the weapon level, and cost
  const handlePistolUpgrade = () => {
    if (playerPoints >= pistolLevelCost) {
      upgradeCost = pistolLevelCost
      updatePlayerPoints(upgradeCost)
      const newLevel = pistolLevel + 1 // Calculate the new level after upgrade
      updatePistolLevel() // Update the level
      updatePistolLevelCost()

      // Determine the upgrade message based on the new level
      // Within Phaser, a similar switch statement exists to determine upgrades based on current level
      let message
      switch (newLevel) {
        case 2:
        case 4:
        case 6:
          message = 'Upgraded: Increased Rate of Fire'
          break
        case 3:
        case 5:
        case 7:
          message = 'Upgraded: Increased Damage'
          break

        default:
          message = 'Pistol Upgraded'
      }

      setUpgradeMessage(message)
      setTimeout(() => setUpgradeMessage(''), 3000) // Reset message after 3 seconds
    } else {
      return
    }
  } // end handlePistolUpgrade function

  const handleItemClick = (buttonName) => {
    setSelectedButton(buttonName)
  }

  const handleArUpgrade = () => {
    if (playerPoints >= arLevelCost) {
      upgradeCost = arLevelCost
      updatePlayerPoints(upgradeCost)
      const newLevel = arLevel + 1 // Calculate the new level after upgrade
      updateArLevel() // Update the level
      updateArLevelCost()

      // Determine the upgrade message based on the new level
      let message
      switch (newLevel) {
        case 2:
        case 4:
        case 6:
          message = 'Upgraded: Rate of Fire'
          break
        case 3:
        case 5:
        case 7:
          message = 'Upgraded: Increased Damage'
          break
        default:
          message = 'AR Upgraded'
      }

      setUpgradeMessage(message)
      setTimeout(() => setUpgradeMessage(''), 3000) // Reset message after 3 seconds
    } else {
      return
    }
  } // end handleArUpgrade function

  const handleShotgunUpgrade = () => {
    if (playerPoints >= shotgunLevelCost) {
      upgradeCost = shotgunLevelCost
      updatePlayerPoints(upgradeCost)
      const newLevel = shotgunLevel + 1
      updateShotgunLevel() // Update the level
      updateShotgunLevelCost()

      // Determine the upgrade message based on the new level
      let message
      switch (newLevel) {
        case 2:
        case 4:
        case 6:
          message = 'Upgraded: Increased Accuracy'
          break
        case 3:
        case 5:
        case 7:
          message = 'Upgraded: Increased Damage'
          break

        default:
          message = 'Shotgun Upgraded'
      }

      setUpgradeMessage(message)
      setTimeout(() => setUpgradeMessage(''), 3000) // Reset message after 3 seconds
    } else {
      return
    }
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

  // JSX content, creates our Inventory menu
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