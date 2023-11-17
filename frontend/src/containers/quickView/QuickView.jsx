import React, {useState, useEffect, useRef} from 'react'
import {Button} from 'antd'
import Earth from '../canvas/Earth.jsx'
import Venus from '../canvas/Venus.jsx'
import Mercury from '../canvas/Mercury.jsx'
import Inventory from '../menu/Inventory.jsx'
import { CloseOutlined, SoundOutlined } from '@ant-design/icons'
import sound from './chiphead64-11pm.mp3'
import './quickView.css'


const QuickView = () => {

    const [buttonWidth, setButtonWidth] = useState( '' )
    const [earthMenuVisible, setEarthMenuVisible] = useState( false )
    const [venusMenuVisible, setVenusMenuVisible] = useState( false )
    const [mercuryMenuVisible, setMercuryMenuVisible] = useState( false )
    const [inventoryVisible, setInventoryVisible] = useState( false )
    const [audioStarted, setAudioStarted] = useState( false )
    const [soundMuteVisible, setSoundMuteVisible] = useState( true )
    const audioRef = useRef( null )
    
    const handleSolarClick = () => {
            console.log( 'Solar button clicked!')
            setEarthMenuVisible( false )
            setVenusMenuVisible( false )
            setMercuryMenuVisible( false )
    }

    const handleEarthClick = () => {
        console.log( 'Earth button clicked!')
        setEarthMenuVisible( !earthMenuVisible )
        setVenusMenuVisible( false )
        setMercuryMenuVisible( false )
    }

    const handleVenusClick = () => {
        console.log( 'Venus button clicked!')
        setEarthMenuVisible( false )
        setVenusMenuVisible( !venusMenuVisible )
        setMercuryMenuVisible( false )
    }

    const handleMercuryClick = () => {
        console.log( 'Mercury button clicked!')
        setEarthMenuVisible( false )
        setVenusMenuVisible( false )
        setMercuryMenuVisible( !mercuryMenuVisible )
    }

    const handleInventoryClick = () => {
        console.log( 'Inventory Button clicked' )
        setInventoryVisible( !inventoryVisible )
    }

    const toggleMuteIcon = () => {
        setSoundMuteVisible( ( prevVisible ) => !prevVisible );
    }


    // method to dynamically resize the buttons
    const resizeButtons = () => {
    const screenWidth = window.innerWidth
    const newWidth = screenWidth * 0.05
    setButtonWidth( `${newWidth}px` )
    }

    // effect to handle starting and stopping of audio
    useEffect( ()=> {
        if( audioStarted ) {

            if( audioRef.current ) {
                audioRef.current.play()
            } // end if

            else {
                const audio = new Audio( sound )
                audioRef.current = audio
                audio.play()
            } // end else

        } // end if

        else {
            if( audioRef.current ) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            } // end if
        } // end else
    }, [audioStarted])

    const startAudio = () => {
        setAudioStarted( !audioStarted )
        toggleMuteIcon()
    }

    // effect to handle the resizing of buttons when the window is resized
    useEffect( () => {
    resizeButtons();
    window.addEventListener( 'resize', resizeButtons )

    return () => {
        window.removeEventListener( 'resize', resizeButtons )
    }
    }, [])
    
     return (
        <div className="quickView__buttons">

            <div className="quickView__button-column left-column" style={{ width: buttonWidth }}>
                <h1>Quick View</h1>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleSolarClick}>System View</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleEarthClick}>Ryugu</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleVenusClick}>Vesta</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleMercuryClick}>Psyche 16</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleMercuryClick}>Ceres</Button>
            </div>

            <div className="quickView__button-column right-column" style={{ width: buttonWidth }}>
                <h1>Menus</h1>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleInventoryClick}>Inventory</Button>
            </div>

            <div className="quickView__soundControl" style={{ width: buttonWidth }}>
                <Button className='toggleSound' onClick = {startAudio} icon={<SoundOutlined style ={{ fontSize: '35px' }} /> } />
                {soundMuteVisible && (
                    <Button className='toggleSound' onClick = {startAudio} icon={<CloseOutlined style ={{ fontSize: '35px' }} /> } />
                )}
            </div>

            {earthMenuVisible && <Earth earthMenuVisible={earthMenuVisible} />}
            {venusMenuVisible && <Venus venusMenuVisible={venusMenuVisible} />}
            {mercuryMenuVisible && <Mercury mercuryMenuVisible={mercuryMenuVisible} />}
            {inventoryVisible && <Inventory /> }

        </div>

        
    )
}

export default QuickView

