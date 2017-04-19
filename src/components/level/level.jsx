import React from 'react'

export default class Levels extends React.Component {
	constructor(props) {
		super(props)

		this.renderLevelIcons = this.renderLevelIcons.bind(this)
	}

	renderLevelIcons(icon, level){
		if(level === 0) {
			return '💩'
		}
		return icon.repeat(level)
	}

	render() {
		return(
			<div>
				<p class="skill-name">{this.props.skill.name}</p>
				<p class="level">Skill:
					<span>{this.renderLevelIcons('👌🏼', this.props.skill.skillLevel)}</span>
				</p>
				<p class="level">Will:
					<span>{this.renderLevelIcons('👌🏼', this.props.skill.willLevel)}</span>
				</p>
			</div>
		)
	}
}
