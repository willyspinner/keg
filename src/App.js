import './App.css';
import React from 'react'
import Graph from './graph'

class App extends React.Component {
  constructor(props) {
    super(props)

  }


  render() {
    return (
      <div className="App">
        <Graph/>
      </div>
    );
  }
}

export default App;
