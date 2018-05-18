import React from 'react'
import BasicProfile from './basic-profile.jsx'
import SkillSearch from '../search/skill-search.jsx'
import Icon from '../icon/icon.jsx'
import Layer from "../layer/layer"
import { apiServer } from '../../env.js'
import {
	toggleSkillsEditMode,
	exitSkillsEditMode,
	editSkill,
	setLastSortedBy,
	updateUserSkills,
	fetchCurrentUser
} from '../../actions'
import { connect } from 'react-redux'

class MyProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: null,
			dataLoaded: false,
			editLayerOpen: false,
			openLayerAt: -1,
			shouldShowAllSkills: true,
			skillSearchOpen: false,
			skillEditOpen: false,
		}
		this.toggleSkillsSearch = this.toggleSkillsSearch.bind(this)
		this.toggleSkillsEdit = this.toggleSkillsEdit.bind(this)
		this.editSkill = this.editSkill.bind(this)
		this.deleteSkill = this.deleteSkill.bind(this)
	}

	componentWillMount() {
		document.body.classList.add('layer-full-open')
		this.props.fetchCurrentUser()
	}

	componentWillUnmount() {
		this.props.exitSkillsEditMode()
		document.body.classList.remove('layer-full-open')
	}

	toggleSkillsSearch() {
		this.props.fetchCurrentUser()
		this.setState({
			skillSearchOpen: !this.state.skillSearchOpen,
		})
	}

	toggleSkillsEdit() {
		this.props.fetchCurrentUser()
		this.props.toggleSkillsEditMode()
		this.setState({
			skillEditOpen: !this.state.skillEditOpen,
		})
		document.body.classList.toggle('is-edit-mode')
	}

	getCurrentUserId() {
		const { currentUser } = this.props
		return currentUser.id
	}

	editSkill(skill, skillLevel, willLevel, isMentor = false) {
		if (skillLevel === '0' && willLevel === '0') {
      alert('Please select a value greater than 0') // eslint-disable-line
			return
		}
		let postData = new FormData()
		postData.append('skill', skill)
		postData.append('skill_level', skillLevel)
		postData.append('will_level', willLevel)
		postData.append('mentor', isMentor)
		const options = {
			method: 'POST',
			body: postData,
			credentials: 'same-origin',
		}
		this.props.updateUserSkills(options, this.getCurrentUserId())
	}

	deleteSkill(skill) {
		const options = { method: 'DELETE', credentials: 'same-origin' }
		const requestURL = `${apiServer}/users/${this.getCurrentUserId()}/skills?skill=${encodeURIComponent(
			skill
		)}`
		fetch(requestURL, options)
			.then(res => {
				if (res.status === 403) {
          alert('session invalid') // eslint-disable-line
					this.setState({
						editLayerOpen: false,
					})
					this.props.fetchCurrentUser()
				}

				if (res.status !== 200) {
					throw Error('error while deleting skills')
				} else {
					this.props.fetchCurrentUser()
				}
			})
			.catch(err => console.log(err))
	}

	render() {
		const {
			skillSearchOpen,
			openLayerAt,
			shouldShowAllSkills,
			skillEditOpen,
			userId,
		} = this.state
		const {
			currentUser: {
				loaded
			}
		}= this.props
		return (
			<Layer>
				{ loaded ? (
					skillSearchOpen ? (
						<div className="profile">
							<SkillSearch
								handleEdit={this.editSkill}
								handleDelete={this.deleteSkill}
								userId={userId}
							/>
							<div className="profile-actions" data-skillsearch={skillSearchOpen}>
								<button
									className="edit-skill-btn"
									onClick={this.toggleSkillsEdit}
									disabled={skillSearchOpen}>
									<Icon name="edit" size={19} />
									Customize skills
								</button>
								<button className="add-skill-btn" onClick={this.toggleSkillsSearch}>
									<Icon name="checkmark" size={19} />
									Done
								</button>
							</div>
						</div>
					) : (
						<div className="profile">
							<BasicProfile
								openLayerAt={openLayerAt}
								shouldShowAllSkills={shouldShowAllSkills}
								editSkill={this.editSkill}
								deleteSkill={this.deleteSkill}
								setLastSortedBy={this.props.setLastSortedBy}
								lastSortedBy={this.props.lastSortedBy}
								getUserProfileData={this.props.getUserProfileData}
								user={this.props.currentUser}
							/>
							<div className="profile-actions" data-skilledit={skillEditOpen}>
								<button className="edit-skill-btn" onClick={this.toggleSkillsEdit}>
									{skillEditOpen ? (
										<Icon name="checkmark" size={18} />
									) : (
										<Icon name="edit" size={18} />
									)}
									{skillEditOpen ? 'Done' : 'Customize skills'}
								</button>
								<button
									className="add-skill-btn"
									onClick={this.toggleSkillsSearch}
									disabled={skillEditOpen}>
									<Icon name="plus" size={18} />
									Add new skill
								</button>
							</div>
						</div>
					)
				) : null }
			</Layer>)
	}
}
function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
		lastSortedBy: state.lastSortedBy,
	}
}
export default connect(mapStateToProps, {
	toggleSkillsEditMode,
	exitSkillsEditMode,
	editSkill,
	setLastSortedBy,
	updateUserSkills,
	fetchCurrentUser
})(MyProfile)
