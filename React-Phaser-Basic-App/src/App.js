// Main file for the application that contains the logic between switching pages

// *** NOTE: this uses react-router-dom version 5. latest version 6 was proving unstable ***

// Imports react-router-dom, which allows for multiple pages to be used
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// imports the style sheet
import './App.css';

// imports game class, which allows application to create and start game canvas
import Game from './game';

// picture on landing screen
var logo = process.env.PUBLIC_URL + '/images/LuffyDies.jpg';


// React function that holds html code for landing screen
function LandingPage() {
  // Inside of the return the link is used the same way an a href is used, to change pages
  return (
    <div>
      <header className="App-header">
          <h1>RIP</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/page2">CLICK HERE TO SAVE LUFFY!!!!</Link>
      </header>
      <p>This page is just using React</p>
    </div>
  );
}


// React function that holds html code for the game screen
function GamePage() {
  // Inside of the return the link is used the same way an a href is used, to change pages
  // ALSO *** The <Game /> is what creates the game canvas and renders it to the page ***
  return (
    <div>
      <header className="App-header">
        <h1>YAY YOU SAVED HIM!!!!</h1>
        <Game />
        <Link to="/">Restart</Link>
      </header>
      <p>This page is made with React as well with an added Phaser game canvas
      </p>
    </div>
  );
}


// Main React function that handles page switching
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/page2" component={GamePage} />
          <Route exact path="/" component={LandingPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;