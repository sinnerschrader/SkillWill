import React from 'react'
import { connect } from 'react-redux'

class SkillItemEditor extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {
			name,
			skillLevel,
			willLevel,
			editSkill,
			deleteSkill
		} = this.props
		return (
			<div className="skill-item-editor">
				<input
					className="skill-item-editor__skill-editor"
					name={`skillLevel_${name}`}
					type="range" value={skillLevel}
					max="3"
					onChange={(e) => editSkill(name, e.target.value, willLevel)} />
				<input
					className="skill-item-editor__will-editor"
					name={`willLevel_${name}`}
					type="range" value={willLevel}
					max="3"
					onChange={(e) => editSkill(name, skillLevel, e.target.value)} />
				<div className="skill-item-editor__delete delete" onClick={() => deleteSkill(name)}></div>
			</div>
		)
	}
}

class SkillItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			skillLevel: this.props.skill.skillLevel,
			willLevel: this.props.skill.willLevel,
			renderSkill: true,
			hasEdited: false
		}
		this.editSkill = this.editSkill.bind(this)
		this.deleteSkill = this.deleteSkill.bind(this)
	}

	editSkill(name, skillLevel, willLevel) {
		this.setState({
			skillLevel,
			willLevel
		})
		this.props.editSkill(name, skillLevel, willLevel)

		//trigger CSS animation
		if(!this.state.hasEdited) {
			this.setState({
				hasEdited: true
			})
			setTimeout(function() {
				this.setState({
					hasEdited: false
				})
			}.bind(this), 3500);
		}
	}

	deleteSkill(name) {
		this.setState({
			renderSkill: false
		})
		this.props.deleteSkill(name)
	}

	render() {
		const {
			key,
			skill: {
				name
			}
		} = this.props
		const {
			skillLevel,
			willLevel
		} = this.state
		return (
			this.state.renderSkill ?
			<li key={key} className="skill-item" data-edited={this.state.hasEdited}>
				<p className="skill-name"><span>{name}</span></p>
				<div className="skill-level">
					<div className="level">
						<div className={`skillBar levelBar levelBar--${skillLevel}`}></div>
					</div>
					<div className="level">
						<div className={`willBar levelBar levelBar--${willLevel}`}></div>
					</div>
					{
						this.props.isSkillEditActive
							? <SkillItemEditor editSkill={this.editSkill} deleteSkill={this.deleteSkill} name={name} skillLevel={skillLevel} willLevel={willLevel} />
							: null
					}
				</div>
			</li>
			: null
		)
	}
}
function mapStateToProps(state) {
	return {
		isSkillEditActive: state.isSkillEditActive
	}
}

export default connect(mapStateToProps)(SkillItem)