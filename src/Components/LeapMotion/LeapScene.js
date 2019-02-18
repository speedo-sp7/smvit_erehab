import React from 'react';

import threeEntryPoint from "./threeEntryPoint"

class LeapScene extends React.Component {
    componentWillMount() {
    }

    componentDidMount() {
        threeEntryPoint(this.threeRootElement);
    }

    render() {
        return (
            <div style={{height: "300px"}} ref={element => this.threeRootElement = element} />
        );
    }
}

export default LeapScene;
