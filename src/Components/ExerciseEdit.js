import React, { Component } from 'react'
import MotionSetup from "./LeapMotion/MotionSetup";
import './ExerciseEdit.css';

class ExerciseEdit extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            recording: null,
            repetitions: 1
        };

        this.setExerciseName = ev => {
            this.setState({
                ...this.state,
                name: ev.target.value
            });
        };

        this.setExerciseRecording = recording => {
            this.setState({
                ...this.state,
                recording: recording
            });
        };

        this.setExerciseRepetitions = ev => {
            this.setState({
                ...this.state,
                repetitions: ev.target.value
            });
        };

        this.getRecordingMetadata = () => {
            return JSON.stringify(this.state.recording);
        }
    };

    render() {
        return (
            <div className="exerciseEdit">
                <div className="header">
                    DEFINE EXERCISE
                </div>
                <div className="container setup">
                    <span>
                        <span className="label">
                            Exercise name &nbsp;
                        </span>
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Enter name..."
                            value={this.state.name}
                            onChange={this.setExerciseName}
                        />
                    </span>

                    <div className="leap-scene">
                        <MotionSetup
                            recording = {this.state.recording}
                            setExerciseRecording={this.setExerciseRecording}
                        />
                    </div>
                    <div className="motion-metadata">
                        <span>
                            Total frames: {this.state.recording ? this.state.recording.frameCount : "0"}
                        </span>
                        <span>
                            Modified: {this.state.recording && this.state.recording.metadata ? this.state.recording.metadata.modified : "-"}
                        </span><
                        span>
                            Frame rate: {this.state.recording && this.state.recording.metadata ? this.state.recording.metadata.frameRate : "0"}
                        </span><span>
                            Generated by: {this.state.recording && this.state.recording.metadata ? this.state.recording.metadata.generatedBy : "-"}
                        </span>
                    </div>

                    <span>
                        <span className="label">
                            Repetitions &nbsp;
                        </span>
                        <input
                            className="form-control form-control-lg form-number"
                            type="number"
                            placeholder="Repetitions"
                            value={this.state.repetitions}
                            onChange={this.setExerciseRepetitions}
                        />
                    </span>
                </div>
                <div className="form-actions">
                    <button>
                        CREATE
                    </button>
                    <button>
                        CANCEL
                    </button>
                </div>
            </div>
        );
    }
}

export default ExerciseEdit