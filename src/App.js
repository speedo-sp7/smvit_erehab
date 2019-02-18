import React, { Component } from 'react';
import logo from './logo.jpg';
import './App.css';
import ProcedureEdit from "./Components/ProcedureEdit";
import ExerciseEdit from "./Components/ExerciseEdit";

class App extends Component {
  constructor(){
    super();
    this.state = {
      procedureView: false
    };

    this.toggleExerciseView = () => {
      this.setState({
          ...this.state,
          procedureView: !this.state.procedureView
      })
    };

    window.toggleView = () => this.toggleExerciseView();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            e-Rehab
          </a>
        </header>

        <div>
            {this.state.procedureView ? <ProcedureEdit /> : <ExerciseEdit/>}
        </div>

      </div>
    );
  }
}

export default App;
