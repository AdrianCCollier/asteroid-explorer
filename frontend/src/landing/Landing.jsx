import React from 'react'
import { Form, Button } from 'antd'
import { Link } from 'react-router-dom';

import './landing.css'

function Landing() {

    console.log( 'Inside landing' );
    return (
      <div className='landing'>
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
                    <Button className ="submit">Submit</Button>
                </Link>
                <p className = "signin">
                    Already have an account ?
                    <a href = "/signIn"> Sign in</a>
                </p>
                <p className = "signin">
                    <a href = "/solarSystem"> Play Locally</a>
                </p>

                <audio autoPlay loop>
                    <source src="chiphead64-11pm.mp3" type="audio/mpeg"/>
                    Your browser does not support the audio element
                </audio>
            </Form>
        </div>

        
      </div>
    );
}

export default Landing;