import React from 'react'
import ReactDOM from 'react-dom'
import User from "../user/user.jsx"
import config from '../../config.json'
import Editor from '../editor/editor.jsx'
import { Link } from 'react-router'
import SkillItem from '../skill-item/skill-item.jsx'
import { connect } from 'react-redux'

class BasicProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			shouldShowAllSkills: this.props.shouldShowAllSkills,
			showMoreLabel: "Mehr",
			editLayerAt: null,
			numberOfSkillsToShow: 6,
			isSkillEditActive: false
		}
		this.showAllSkills = this.showAllSkills.bind(this)
		this.getAvatarColor = this.getAvatarColor.bind(this)
		this.sortSkills = this.sortSkills.bind(this)
		this.renderTopWills = this.renderTopWills.bind(this)
		this.renderSkills = this.renderSkills.bind(this)
		this.renderSortButtons = this.renderSortButtons.bind(this)
		this.removeAnimationClass = this.removeAnimationClass.bind(this)
		this.toggleSkillEdit = this.toggleSkillEdit.bind(this)
		this.renderSearchedSkills = this.renderSearchedSkills.bind(this)
	}

	componentWillMount() {
		this.setState({
			sortedSkills: this.sortSkills('skillLevel', 'desc'),
			topWills: this.sortSkills('willLevel', 'desc')
		})
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			sortedSkills: this.sortSkills(this.state.lastSortedBy, 'desc'),
			topWills: this.sortSkills('willLevel', 'desc')
		})
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this).addEventListener('animationend', this.removeAnimationClass)
	}

	removeAnimationClass() {
		ReactDOM.findDOMNode(this).classList.remove('animateable')
		ReactDOM.findDOMNode(this).removeEventListener('animationend', this.removeAnimationClass)
	}

	showAllSkills(e) {
		e.preventDefault()
		const { shouldShowAllSkills, numberOfSkillsToShow } = this.state
		this.setState({
			shouldShowAllSkills: !shouldShowAllSkills,
			numberOfSkillsToShow: numberOfSkillsToShow === 6 ? Infinity : 6
		})
		e.target.classList.toggle("open")
	}

	toggleSkillEdit() {
		this.setState({
			isSkillEditActive: !this.state.isSkillEditActive
		})
	}

	getAvatarColor() {
		const colors = ["blue", "red", "green"]
		let index = this.props.user.id
			.toLowerCase()
			.split('')
			.map(c => c.charCodeAt(0))
			.reduce((a, b) => a + b)
		return colors[index % colors.length]

	}

	sortSkills(criterion, order = 'asc') {
		let skills
		if (this.state.lastSortedBy === criterion) {
			skills = [...this.state.sortedSkills]
			skills.reverse()
		} else {
			skills = [...this.props.user.skills]
			skills.sort((a, b) => {
				if (order === 'asc') {
					return a[criterion].toString().toUpperCase() < b[criterion].toString().toUpperCase() ? -1 : 1
				} else {
					return a[criterion].toString().toUpperCase() < b[criterion].toString().toUpperCase() ? 1 : -1
				}
			})
			this.setState({
				lastSortedBy: criterion,
			})
		}
		return skills
	}

	sortAscending(a, b) {
		return a - b
	}
	sortDescending(a, b) {
		return b - a
	}

	renderTopWills(skills) {
		return (
			<li className="top-wills skill-listing">
				<div className="listing-header">Top Wills</div>
				<ul className="skills-list">
					{skills.map((skill, i) => {
						if (i < 5 && skill['willLevel'] > 1) {
							return (
								<SkillItem
									editSkill={this.props.editSkill}
									deleteSkill={this.props.deleteSkill}
									skill={skill}
									key={skill.name}
								/>
							)
						}
					})}
				</ul>
			</li>
		)
	}

	renderSkills(skills, numberOfSkillsToShow) {
		return (
			<ul className="skills-list">
				{skills.map((skill, i) => {
					if (i < numberOfSkillsToShow) {
						return (
							<SkillItem
								editSkill={this.props.editSkill}
								deleteSkill={this.props.deleteSkill}
								skill={skill}
								key={skill.name}
							/>
						)
					}
				}
				)}
			</ul>
		)
	}

	renderSortButtons() {
		return (
			<ul className="sort-buttons">
				<li className="sort-button sort-button-name" onClick={() => this.setState({ sortedSkills: this.sortSkills('name', 'asc') })}
				><span className="sort-button-label">Name</span></li>
				<li className="sort-button sort-button-skill" onClick={() => this.setState({ sortedSkills: this.sortSkills('skillLevel', 'desc') })}
				><span className="sort-button-label">Skill</span></li>
				<li className="sort-button sort-button-will" onClick={() => this.setState({ sortedSkills: this.sortSkills('willLevel', 'desc') })}
				><span className="sort-button-label">Will</span></li>
			</ul>
		)
	}

	renderSearchedSkills() {
		const { skills } = this.props.user
		const { searchedSkills } = this.props
		if (!searchedSkills || searchedSkills.length <= 0) {
			return
		}
		return (
			<li className="searched-skills skill-listing">
				<div className="listing-header">Gesuchte Skills</div>
				<ul className="skills-list">
					{skills
						.filter(skill => searchedSkills.indexOf(skill.name) !== -1)
						.map((skill, i) => {
							return (
								<SkillItem key={skill.name} skill={skill} />
							)
						})
					}
				</ul>
			</li>
		)
	}

	render() {
		const {
			additionalSkillListing,
			user: {
				id,
				firstName,
				lastName,
				title,
				location,
				mail,
				phone,
				skills
			},
			prevUser,
			nextUser
		} = this.props

		const {
			shouldShowAllSkills,
			numberOfSkillsToShow,
			sortedSkills,
			topWills
		} = this.state
		return (
			<ul className={`basic-profile ${this.props.shouldSkillsAnimate ? "animateable" : ""}`}>
				<li className="info">
					<div className={`avatar avatar-${this.getAvatarColor()}`}><span className="fallback-letter">{firstName.charAt(0).toUpperCase()}</span></div>
					<p className="name">{firstName} {lastName}</p>
					<p className="id">{id}</p>
					<p className="department">{title}</p>
					<p className="location phone">{location} / TEL. {phone}</p>
					<Link className="mail" href={`mailto:${mail}`} target="_blank"></Link>
					<Link className="slack" href={`https://sinnerschrader.slack.com/messages/@${firstName.toLowerCase()}.${lastName.toLowerCase()}`} target="_blank"></Link>
					<Link className="move" href={`http://move.sinnerschrader.com/?id=${id}`} target="_blank" />
				</li>

				{this.renderSearchedSkills()}

				{this.renderTopWills(topWills)}

				<li className="all-skills skill-listing">
					<div className="listing-header">Alle Skills
						{this.renderSortButtons()}
					</div>

					{this.renderSkills(sortedSkills, numberOfSkillsToShow)}

					<a className="show-more-link" onClick={this.showAllSkills} href=""></a>
				</li>
			</ul>
		)
				}
}

function mapStateToProps(state) {
	return {
		shouldSkillsAnimate: state.shouldSkillsAnimate,
		searchedSkills: state.results.searched,
		user: state.user
	}
}
export default connect(mapStateToProps)(BasicProfile)
