import './App.css';
import Header from './Header';
import React from 'react';
import Graph from './Graph';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Graph/>
      </div>
    );
  }
}

export default App;
