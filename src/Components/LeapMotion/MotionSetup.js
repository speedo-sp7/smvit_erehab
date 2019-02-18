import React from 'react';
import LeapScene from "./LeapScene";

import "./MotionSetup.css";

class MotionSetup extends React.Component {
    constructor() {
        super();
        this.state = {
            isRecording: false,
            isPlaying: false
        };

        this.startRecording = () => {
            if (window.leapPlayer){
                window.leapPlayer.stop();
                window.leapPlayer.record();
                this.props.setExerciseRecording(null);
                this.setState({
                    isRecording: true,
                    isPlaying: false
                });
            }
            else alert("Leap Motion not working!");
        };

        this.finishRecording = () => {
            if (window.leapPlayer){
                window.leapPlayer.finishRecording();
                this.setState({
                    isRecording: false,
                    isPlaying: false
                });
                this.props.setExerciseRecording(window.leapPlayer.recording);
            }
            else alert("Leap Motion not working!");
        };

        /*
        finishRecording: function () {
          // change to the playbackHandler which suppresses frames:
          this.controller.connection.protocol = this.playbackProtocol;
          this.recording.setFrames(this.recording.frameData);
          this.controller.emit('playback.recordingFinished', this)
        },
         */

        this.startPlayback = () => {
            if (window.leapPlayer){
                window.leapPlayer.recording = this.props.recording;
                window.leapPlayer.play();
                this.setState({
                    isRecording: false,
                    isPlaying: true
                });
            }
            else alert("Leap Motion not working!");
        };

        this.finishPlayback = () => {
            if (window.leapPlayer){
                window.leapPlayer.pause();
                this.setState({
                    isRecording: false,
                    isPlaying: false
                });
            }
            else alert("Leap Motion not working!");
        };
    }

    render() {
        window.recorder = this.state;

        return (
            <div className="motionSetup">
                <span className="label">
                    Exercise preview
                </span>
                <LeapScene />
                <div className="buttonGroup">
                    <button
                        onClick={this.state.isRecording ? this.finishRecording : this.startRecording}
                        className={this.state.isRecording ? "red" : "gray"}
                    >
                        {this.state.isRecording ? "STOP RECORDING" : "START RECORDING"}
                    </button>
                    {
                        this.props.recording &&
                        <button
                            className="green"
                            onClick={this.state.isPlaying ? this.finishPlayback : this.startPlayback}
                        >
                            {this.state.isPlaying ? "STOP" : "PLAY"}
                        </button>
                    }
                </div>
            </div>
        );
    }
}

export default MotionSetup;
