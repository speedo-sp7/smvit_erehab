import React, { Component } from 'react'

class ProcedureEdit extends Component {
    constructor(){
        super();
        this.state = {
            exercises: [],
            patient: null,
            deadline: new Date()
        };
    }



    render() {
        return (
            <div className="procedureEdit">
                <div className="header">
                    PROCEDURE EDIT
                </div>
            </div>
        );
    }
}

export default ProcedureEdit