import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Main from "./components/Main";
import Second from "./components/Second";

function App() {
  return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Main} />
          <Route exact path="/view" component={Second} />
        </div>
      </Router>
  );
}

export default App;
