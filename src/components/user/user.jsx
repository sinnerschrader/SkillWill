 import React from 'react';
 import { Router, Route, Link } from 'react-router'

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
 
    handleClick() {
        document.body.classList.add('layerOpen');
    }

  render() {
    return(
        <ul class="user">
            <li class="info">
                <Link class="name"to={`search/profile/${this.props.data.id}`} activeClassName="active" id={`${this.props.data.id}`} onClick={this.handleClick}>{this.props.data.firstName} {this.props.data.lastName}</Link>
                <span class="id">{this.props.data.id}</span>
                <span class="department">{this.props.data.title}</span>
            </li>
            <li class="location">{this.props.data.location}</li>
            <li class="skills">
                <ul class="skills-list">
                {this.props.searchedSkills.map((data, i) => { 
                    return(
                        <li key={i} class="skill-item">
                            <p class="skill-name">{data.name}</p>
                            <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                        </li>
                    );
                })}
                </ul>
            </li>  
        </ul>  
    )
}
}