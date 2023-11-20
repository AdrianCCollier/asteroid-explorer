import React, { useState } from 'react'
import { Button } from 'antd'
import './inventory.css'

const Inventory = () => {

  const [selectedButton, setSelectedButton] = useState( null )
    
  const [playerPoints, setPlayerPoints] = useState(
    parseInt( localStorage.getItem( 'playerPoints')) || 0
  )

  const[pistolLevel, setPistolLevel] = useState(
    parseInt( localStorage.getItem( 'pistolLevel' ) ) || 1
  )

  const [pistolLevelCost, setPistolLevelCost] = useState(
    parseInt( localStorage.getItem( 'pistolLevelCost' ) ) || 1500
  )

  const[arLevel, setArLevel] = useState(
    parseInt( localStorage.getItem( 'pistolLevel' ) ) || 1
  )

  const [arLevelCost, setArLevelCost] = useState(
    parseInt( localStorage.getItem( 'pistolLevelCost' ) ) || 1500
  )

  const[shotgunLevel, setShotgunLevel] = useState(
    parseInt( localStorage.getItem( 'pistolLevel' ) ) || 1
  )

  const [shotgunLevelCost, setShotgunLevelCost] = useState(
    parseInt( localStorage.getItem( 'pistolLevelCost' ) ) || 1500
  )

  console.log( JSON.parse( localStorage.getItem( 'pistol' ) ) )

  var upgradeCost = 0

  const updatePistolLevel = () => {
    const updatedPistolLevel = pistolLevel - 1
    setPistolLevel( updatedPistolLevel )
    localStorage.setItem( 'pistolLevel', pistolLevel.toString() )
  } // end updatePistolLevel function

  const updatePistolLevelCost = () => {
    const updatedPistolLevelCost = pistolLevelCost - 500
    setPistolLevelCost( updatedPistolLevelCost )
    localStorage.setItem( 'pistolLevelCost', pistolLevelCost.toString() )
  }

  const updateArLevel = () => {
    const updatedArLevel = arLevel
    setArLevel( updatedArLevel )
    localStorage.setItem( 'arLevel', arLevel.toString() )
  } // end updateArLevel function

  const updateArLevelCost = () => {
    const updatedArLevelCost = arLevelCost
    setArLevelCost( updatedArLevelCost )
    localStorage.setItem( 'arLevelCost', arLevelCost.toString() )
  }

  const updateShotgunLevel = () => {
    const updatedShotgunLevel = shotgunLevel
    setShotgunLevel( updatedShotgunLevel )
    localStorage.setItem( 'shotgunLevel', shotgunLevel.toString() )
  } // end updateShotgunLevel function

  const updateShotgunLevelCost = () => {
    const updatedShotgunLevelCost = shotgunLevelCost
    setShotgunLevelCost( updatedShotgunLevelCost )
    localStorage.setItem( 'shotgunLevelCost', shotgunLevelCost.toString() )
  }

  const updatePlayerPoints = ( upgradeCost ) => {
    const updatedPoints = playerPoints - upgradeCost
    setPlayerPoints( updatedPoints )
    localStorage.setItem( 'playerPoints', updatedPoints.toString() )
  } // end updatePlayerPoints function

  const handlePistolUpgrade = () => {
    if( playerPoints > pistolLevelCost ) {
      upgradeCost = pistolLevelCost
      updatePlayerPoints( upgradeCost )
      updatePistolLevel()
      updatePistolLevelCost()
    } // end if
    else return;
  } // end handlePistolUpgrade function

  const handleItemClick = ( buttonName ) => {
    setSelectedButton( buttonName )
  }

  const handleArUpgrade = () => {
    if( playerPoints > arLevelCost ) {
      upgradeCost = arLevelCost
      updatePlayerPoints( upgradeCost )
      updateArLevel()
      updateArLevelCost()
    } // end if
    else return;
  } // end handleArUpgrade function

  const handleShotgunUpgrade = () => {
    if( playerPoints > shotgunLevelCost ) {
      upgradeCost = shotgunLevelCost
      updatePlayerPoints( upgradeCost )
      updateShotgunLevel()
      updateShotgunLevelCost()
    } // end if
    else return;
  } // end handleShotgunUpgrade function

  return (
    <div className = 'inventory-menu'>
        <div className = 'menu' style={{width: window.innerWidth * 0.76, height: window.innerHeight * 0.78}}>
            <h1 className='gradient__text'>Inventory</h1>
            <h2>Your Points: {playerPoints}</h2>
            <ul>
                <Button className='item' >Pistol</Button>
                <Button className='item'>AR</Button>
                <h3>LVL: {pistolLevel}  ${pistolLevelCost}</h3>
                <h3>LVL: {arLevel}  ${arLevelCost}</h3>
                <Button className='upgrade' onClick={ handlePistolUpgrade }>UPGRADE</Button>
                <Button className='upgrade' onClick={ handleArUpgrade }>UPGRADE</Button>
                <Button className='item'>Shotgun</Button>
                <Button className='item'>?</Button>
                <h3>LVL: {shotgunLevel}  ${shotgunLevelCost}</h3>
                <h3>LVL: 1  $1,500</h3>
                <Button className='upgrade' onClick={ handleShotgunUpgrade }>UPGRADE</Button>
                <Button className='upgrade' >UPGRADE</Button>
            </ul>
        </div>
    </div>
  )
}

export default Inventory