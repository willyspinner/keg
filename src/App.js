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
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Graph/>
          <div>
            <p> Controls: </p>
            <ul>
              <li> Create node: hold <code>shift</code> and left click at the location of your new node.</li>
              <li> Create edge: hold <code>shift</code> and drag from the originating node to the destination node to create an edge</li>
              <li> Deleting edge or node: simply press <code>delete</code> </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
