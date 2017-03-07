 import React from 'react';
 import { Router, Route, Link } from 'react-router'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
    }

  render() {
    return(
        <ul class="user">
            <li class="info">
                <span class="name" id={`${this.props.data.name}`}>{this.props.data.name}</span>
            </li>
        </ul>  
    )
}
}