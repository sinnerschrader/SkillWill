 import React from 'react'
 import { Router, Route, Link } from 'react-router'
 import RangeSlider from '../range-slider/range-slider.jsx'
 import Config from '../../config.json'

export default class Editor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initialSkillLevel: this.props.skillLvl,
            initialWillLevel: this.props.willLvl,
            skillLevel: this.props.skillLvl,
            willLevel:  this.props.willLvl
        }
        this.handleSliderChange = this.handleSliderChange.bind(this)
        this.handleAccept = this.handleAccept.bind(this)
    }

    handleSliderChange(val, type) {
        if ( type == "skill") {
            this.setState({
                skillLevel: val
            })
        } else {
            this.setState({
                willLevel: val
            })
        }
    }

    handleAccept() {
        this.props.handleAccept(this.props.skillName, this.state.skillLevel, this.state.willLevel)
        this.props.handleClose()
    }

    render() {
        return(
            <div class="editor">
                <div class="action-buttons">
                    <a  class="check" onClick={this.handleAccept}></a>
                    <a  class="cancel" onClick={this.props.handleClose}></a>
                </div>
                <div class="slider-container">
                    <p class="slider-description">Dein Skill-Level</p>
                    <RangeSlider onSlide={this.handleSliderChange} type="skill" defaultValue={this.state.skillLevel} legend={Config.skillLegend}/>
                    <p class="slider-description">Dein Will-Level</p>
                    <RangeSlider onSlide={this.handleSliderChange} type="will" defaultValue={this.state.willLevel} legend={Config.willLegend}/>
                </div>
            </div>
        )
    }
}
