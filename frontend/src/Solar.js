import React from 'react';
import './Solar.css';
import './index.css';
import { Header, CanvasContainer } from './containers';

function Solar() {



  return (
    <div className="solar">
      <Header />
      <div className= "solar__content" >
        <div className = 'solar__content-dynamic-canvas'>
          <CanvasContainer />
        </div>
      </div>
    </div>
  );
}

export default Solar;
