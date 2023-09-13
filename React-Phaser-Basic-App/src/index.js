// initial Java script file that imports react, and renders the react application by calling App() function in App.JS file

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);