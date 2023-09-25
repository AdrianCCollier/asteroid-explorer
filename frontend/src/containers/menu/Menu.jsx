import React from 'react';
import { Button } from 'antd';
import './menu.css';

function Menu({canvasDimensions}) {

    console.log( 'Inside Menu' );

    const menuStyle = {
        width: `${canvasDimensions.width}px`,
        height: `${canvasDimensions.height}px`,
    };

    const texstStyle = {
        width: `${canvasDimensions.width * 0.2}px`,
        height: `${canvasDimensions.height * 0.9}px`,      
    }

    return (
        <div className = 'frontend__containers__menu' style = {menuStyle}>
            <div className = 'frontend__containers__menu__info' style = {texstStyle}>
                <div className = 'frontend__containers__menu__textbox'>
                    <h1>Name:</h1>
                    <p>XYZ</p>
                    <h2>Diameter:</h2>
                    <p>XYZ</p>
                    <h2>Distance from Earth:</h2>
                    <p>XYZ</p>
                </div>
                
            </div>
            <Button className = 'frontend__containers__menu__button custom-button'>Invade</Button>
        </div>
      );
    }

export default Menu;