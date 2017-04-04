import React from 'react'
import { Router, Route, Link } from 'react-router'

export default class RangeSlider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: "lvl" + this.props.defaultValue
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        e.preventDefault()
        let val =  e.target.value
        this.props.onSlide(val, this.props.type)
    }

    render() {
        return(
            <div class="range-slider">
                <div class={`level-bar ${this.state.progress}`}></div>
                <span class="step lvl1"></span>
                <span class="step lvl2"></span>
                <span class="step lvl3"></span>
                <input type='range' min='0' max='3' value={this.props.defaultValue} defaultValue={this.props.defaultValue} onChange={this.handleChange} />
                <div class="legend">
                    {this.props.legend.map( (data, i) => {
                        return (
                            <div class={`legend-level-${i}`} key="{i}">
															<span class="legend-label">{data}</span>
														</div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
