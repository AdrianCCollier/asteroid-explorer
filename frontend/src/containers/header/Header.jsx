import React from 'react';
import './header.css'


// Creates a header div
const Header = () => {
    return (
        <div className = "solarsystem__header section__padding">
            <div className = "solarsystem__header-content section__padding">
                <h1 className = "gradient__text">Asteroid Explorer</h1>
            </div>
        </div>
    )
}

export default Header