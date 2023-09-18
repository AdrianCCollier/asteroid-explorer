import React, { useState } from 'react';

function Menu() {
    
    const [isOpen, setIsOpen] = useState( false );

    const toggleMenu = () => {
        setIsOpen( !isOpen );
    };

    return (
        <div className="frontend__containers__menu">
        </div>
      );
    }

export default Menu