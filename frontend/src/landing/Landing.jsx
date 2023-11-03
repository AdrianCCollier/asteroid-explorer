import React, { useState, useEffect } from 'react'
import { Form, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Header } from '../containers'
import sound from './chiphead64-11pm.mp3'

import './landing.css'

function Landing() {

    const [audioStarted, setAudioStarted] = useState( false );

    useEffect( () => {
        if( audioStarted ) {
            const audio = new Audio( sound );
            audio.play();
        } // end if
    }, [audioStarted]);

    const startAudio = () => {
        setAudioStarted( true );
    };

    console.log( 'Inside landing' );
    return (
      <div className='landing'>
        <Header />
        <div className = 'body' >
            
            <Form autoComplete='off' className='form'>
                <p className='title'>Register</p>
                <div className='form-group'>
                    <label >
                        <input type ="text" required />
                        <span>Username</span>
                    </label>
                    <label >
                        <input type ="password" required />
                        <span>Password</span>
                    </label>
                    <label >
                        <input type ="password" required />
                        <span>Confirm Password</span>
                    </label>
                </div>
                
                <Link to='/solarSystem'>
                    <Button className ="submit" onClick = {startAudio}>Submit</Button>
                </Link>
                
                <p className = "signin">
                    Already have an account ?
                    <a href = "/signIn"> Sign in</a>
                </p>
                <p className = "signin">
                    <Link to = '/solarSystem' >
                        <div className = 'tooltip-container'>
                            <Button className = "submit">Quick Play</Button>
                            <div className = 'tooltip'>? Progress will be stored locally</div>
                        </div>
                    </Link>
                </p>

            </Form>
        </div>

        
      </div>
    );
}

export default Landing;