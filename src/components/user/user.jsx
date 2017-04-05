 import React from 'react'
 import { Router, Route, Link, browserHistory } from 'react-router'

export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            skillsToShow: [] // e.g. only searched skills
        }

        const allSkills= this.props.data.skills
        // show only searched skills
        allSkills.map((skill,i) => {
            let isASearchedSkill = this.props.searchTerms.indexOf(skill.name)
            if (isASearchedSkill > -1) {
                const skillLevel = skill.skillLevel
                //convert the skill- and willlevel into a visual component
                if (skillLevel == 0) {
                    skill.skillLevel = "-"
                } else {
                    skill.skillLevel = ""
                    for (var counter = 0;  counter < skillLevel;  counter++) {
                        skill.skillLevel= skill.skillLevel + "◼"
                    }
                }
                const willLevel = skill.willLevel
                if (willLevel == 0) {
                    skill.willLevel = "-"
                } else {
                    skill.willLevel = ""
                    for (var counter = 0;  counter < willLevel;  counter++) {
                        skill.willLevel= skill.willLevel + "◼"
                    }
                }

                this.setState({
                    skillsToShow: this.state.skillsToShow.concat([skill])
                })
            }
        })

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        document.body.classList.add('layer-open')
    }


  render() {
    return(
        <ul class="user">
            <li class="info">
							<Link
								class="name"
								to={`${location.pathname}/profile/${this.props.data.id}`} activeClassName="active"
								id={`${this.props.data.id}`}
								onClick={this.handleClick}
							>
								{this.props.data.firstName} {this.props.data.lastName}
							</Link>
							<span class="id">{this.props.data.id}</span>
							<span class="department">{this.props.data.title}</span>
            </li>
            <li class="location">{this.props.data.location}</li>
            <li class="skills">
							<ul class="skills-list">
								{this.state.skillsToShow.map((data, i) => {
									return(
										<li key={i} class="skill-item">
											<p class="skill-name">{data.name}</p>
											<p class="level">skillLevel:
												<span>{data.skillLevel}</span>
											</p>
											<p>willLevel:
												<span>{data.willLevel}</span>
											</p>
										</li>
									)
								})}
							</ul>
            </li>
        </ul>
    )
}
}
