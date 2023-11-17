// Starting point for react application

import React from 'react';
import ReactDOM from 'react-dom/client';
import Solar from './Solar';

// Style
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));


localStorage.setItem('pistol', JSON.stringify(true))

if (localStorage.getItem('shotgun') == null)
    localStorage.setItem('shotgun', JSON.stringify(false))

if (localStorage.getItem('ar') == null)
    localStorage.setItem('ar', JSON.stringify(false))

if (localStorage.getItem('bossKills') == null)
    localStorage.setItem('bossKills', JSON.stringify(0))

root.render(
    <Solar />
);