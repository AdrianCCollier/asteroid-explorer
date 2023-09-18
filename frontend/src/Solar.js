import React from 'react';
import './Solar.css';
import './index.css';
import { Header, CanvasContainer, Menu } from './containers';

function Solar() {

  return (
    <div className="solar">
      <Header />
      <div className= "solar__content" >
        <CanvasContainer />
        <Menu />
      </div>
    </div>
  );
}

export default Solar;
