import React, {useState, useEffect} from 'react'
import {Button} from 'antd'
import Earth from '../canvas/Earth.jsx'
import Venus from '../canvas/Venus.jsx'
import Mercury from '../canvas/Mercury.jsx'
import './quickView.css'


const QuickView = () => {

    const [buttonWidth, setButtonWidth] = useState( '' );
    const [earthMenuVisible, setEarthMenuVisible] = useState( false );
    const [venusMenuVisible, setVenusMenuVisible] = useState( false );
    const [mercuryMenuVisible, setMercuryMenuVisible] = useState( false );
    
    const handleSolarClick = () => {
            console.log( 'Solar button clicked!');
            setEarthMenuVisible( false );
            setVenusMenuVisible( false );
            setMercuryMenuVisible( false );
    } ;

    const handleEarthClick = () => {
        console.log( 'Earth button clicked!');
        setEarthMenuVisible( !earthMenuVisible );
        setVenusMenuVisible( false );
        setMercuryMenuVisible( false );
    } ;

    const handleVenusClick = () => {
        console.log( 'Venus button clicked!');
        setEarthMenuVisible( false );
        setVenusMenuVisible( !venusMenuVisible );
        setMercuryMenuVisible( false );
    } ;

    const handleMercuryClick = () => {
        console.log( 'Mercury button clicked!');
        setEarthMenuVisible( false );
        setVenusMenuVisible( false );
        setMercuryMenuVisible( !mercuryMenuVisible );
    } ;


    // method to dynamically resize the buttons
    const resizeButtons = () => {
    const screenWidth = window.innerWidth;
    const newWidth = screenWidth * 0.07;
    setButtonWidth( `${newWidth}px` );
    };

    // effect to handle the resizing of buttons when the window is resized
    useEffect( () => {
    resizeButtons();
    window.addEventListener( 'resize', resizeButtons );

    return () => {
        window.removeEventListener( 'resize', resizeButtons );
    };
    }, []);
    
     return (
        <div className="quickView__buttons">

            <div className="quickView__button-column left-column" style={{ width: buttonWidth }}>
                <h1>Quick View</h1>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleSolarClick}>Solar System</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleEarthClick}>Earth</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleVenusClick}>Venus</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }} onClick={handleMercuryClick}>Mercury</Button>
            </div>

            <div className="quickView__button-column right-column" style={{ width: buttonWidth }}>
                <h1>Menus</h1>
                <Button style={{ width: buttonWidth, height: buttonWidth }}>Inventory</Button>
                <Button style={{ width: buttonWidth, height: buttonWidth }}>Equipment</Button>
            </div>

            {earthMenuVisible && <Earth earthMenuVisible={earthMenuVisible} />}
            {venusMenuVisible && <Venus venusMenuVisible={venusMenuVisible} />}
            {mercuryMenuVisible && <Mercury mercuryMenuVisible={mercuryMenuVisible} />}

        </div>

        
    )
}

export default QuickView

