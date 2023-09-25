import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const showMenu = () => setIsMenuVisible(true);

  return (
    <MenuContext.Provider value={{ isMenuVisible, showMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}