import React from 'react';
import { Button } from 'antd';
import './menu.css';

import { Link } from 'react-router-dom';


// Menu will need a new prop for asteroid information
function Menu({canvasDimensions, asteroidInformation, closeMenu}) {

    console.log( 'Inside menu Screen' );

    const menuStyle = {
        width: `${window.innerWidth * 0.77}px`,
        height: `${canvasDimensions.height}px`,
    }; // end menuStyle

    const texstStyle = {
        width: `${canvasDimensions.width * 0.2}px`,
        height: `${canvasDimensions.height * 0.9}px`,      
    }; // end textStyle

    return (
        <div className = 'frontend__containers__menu' style = {menuStyle}>
            <div className = 'frontend__containers__menu__info' style = {texstStyle}>
                <div className = 'frontend__containers__menu__textbox'>
                    <h1>Name:</h1>
                    <p>{asteroidInformation.name}</p>
                    <h2>Diameter:</h2>
                    <p>{asteroidInformation.diameter} km</p>
                    <h2>Distance from Earth:</h2>
                    <p>{asteroidInformation.distanceFromEarth} au</p>
                </div>

                
                    
            </div>
            <Button className = 'frontend__containers__menu-closeButton close-button' onClick={closeMenu}></Button>
            <Link to="/game">
                <Button className='frontend__containers__menu__button custom-button'>EXPLORE</Button>
             </Link>

        </div>
      );
    }

export default Menu;