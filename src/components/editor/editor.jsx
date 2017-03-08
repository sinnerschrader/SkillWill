 import React from 'react';
 import { Router, Route, Link } from 'react-router'
 import RangeSlider from '../range-slider/range-slider.jsx'

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialSkillLevel: 1,
            initialWillLevel: 2,
            skillLevel: 1,
            willLevel:  2,
        }
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
    }
    
    handleSliderChange(val, type) {
        if( type == "skill") {
            this.setState({
                skillLevel: val
            });
        }
        else {
            this.setState({
                willLevel: val
            });
        }
    }

    handleAccept() {
        this.props.handleAccept(this.props.skillName, this.state.skillLevel, this.state.willLevel);
        this.props.handleClose();
    }

    render() {
        return(
            <ul class="editor">
                    <li>
                        <RangeSlider onSlide={this.handleSliderChange} type="skill" defaultValue={this.state.skillLevel}/>
                        <RangeSlider onSlide={this.handleSliderChange} type="will" defaultValue={this.state.willLevel}/>
                    </li>
                    <li>
                        <a onClick={this.handleAccept}>ACCEPT</a>
                        <a onClick={this.props.handleClose}>CLOSE</a>
                    </li>
            </ul>
        )
    }
}