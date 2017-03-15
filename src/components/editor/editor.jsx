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
            skillLegend: ["n/a","Anfänger","Fortgeschritten","Experte"],
            willLegend: ["n/a","Nope","Gerne","Yes, Yes, Yes!"]
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
                    <li class="slider-container">
                        <p>Dein Skill-Level</p>
                        <RangeSlider onSlide={this.handleSliderChange} type="skill" defaultValue={this.state.skillLevel} legend={this.state.skillLegend}/>
                        <p>Dein Will-Level</p>
                        <RangeSlider onSlide={this.handleSliderChange} type="will" defaultValue={this.state.willLevel} legend={this.state.willLegend}/>
                    </li>
                    <li class="action-buttons">
                        <a onClick={this.handleAccept}>✓</a>
                        <a onClick={this.props.handleClose}>X</a>
                    </li>
            </ul>
        )
    }
}

