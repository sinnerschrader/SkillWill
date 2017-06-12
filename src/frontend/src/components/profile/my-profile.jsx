import React from 'react'
import { Router, Link, browserHistory } from 'react-router'
import BasicProfile from "./basic-profile.jsx"
import SkillSearch from "../search/skill-search.jsx"
import config from '../../config.json'
import Editor from '../editor/editor.jsx'
import Cookies from 'react-cookie'
import { getUserProfileData, toggleSkillsEditMode, editSkill, setLastSortedBy } from '../../actions'
import { connect } from 'react-redux'

class MyProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			session: undefined,
			userId: this.props.params.id,
			data: null,
			dataLoaded: false,
			editLayerOpen: false,
			openLayerAt: -1,
			shouldShowAllSkills: false,
			skillSearchOpen: false
		}
		this.checkAndOpenLogin = this.checkAndOpenLogin.bind(this)
		this.toggleSkillsSearch = this.toggleSkillsSearch.bind(this)
		this.toggleSkillsEdit = this.toggleSkillsEdit.bind(this)
		this.editSkill = this.editSkill.bind(this)
		this.deleteSkill = this.deleteSkill.bind(this)
		this.getProfileData = this.getProfileData.bind(this)
	}

	componentWillMount() {
		if (!this.checkAndOpenLogin()) {
			browserHistory.push("/my-profile/login")
		}
		this.props.getUserProfileData(this.state.userId)
		if (!this.checkUser()) {
			browserHistory.push("/my-profile/login")
		}
		document.body.classList.add('my-profile-open')
	}

	componentWillUnmount() {
		document.body.classList.remove('my-profile-open')
	}

	getProfileData() {
		const { userId } = this.state
		fetch(`${config.backendServer}/users/${userId}`, { credentials: 'same-origin' })
			.then(r => r.json())
			.then(data => {
				this.setState({
					data: data,
					dataLoaded: true
				})
			})
			.catch(function (error) {
				console.error(error)
			})
	}

	checkAndOpenLogin() {
		const session = this.state.session || Cookies.load("session")
		if (session != this.state.session || !session) {
			this.setState({ session: session })
		}
		return !!session
	}

	checkUser() {
		const { userId } = this.state
		// check if the profiles userID matches with the logged in user
		const user = Cookies.load("user")
		if (user != userId) {
			return false
		}
		return true
	}

	toggleSkillsSearch() {
		this.setState({
			skillSearchOpen: !this.state.skillSearchOpen
		})
	}

	toggleSkillsEdit() {

		this.props.getUserProfileData(this.state.userId)
		this.props.toggleSkillsEditMode()
	}

	editSkill(skill, skillLevel, willLevel) {
		const { userId, session } = this.state
		if (skillLevel === '0' && willLevel === '0') {
			alert('not allowed')
			return
		}
		let postData = new FormData()
		postData.append("skill", skill)
		postData.append("skill_level", skillLevel)
		postData.append("will_level", willLevel)
		postData.append("session", session)
		const options = { method: "POST", body: postData, credentials: 'same-origin' }
		const requestURL = `${config.backendServer}/users/${userId}/skills`
		this.props.editSkill(requestURL, options)
	}

	deleteSkill(skill) {
		const { userId, session } = this.state
		const options = { method: "DELETE", credentials: 'same-origin' }
		const requestURL = `${config.backendServer}/users/${userId}/skills?session=${session}&skill=${skill}`
		fetch(requestURL, options)
			.then(res => {
				if (res.status == 401) {
					alert('Session abgelaufen')
					Cookies.remove("session")
					this.setState({
						session: undefined,
						editLayerOpen: false
					})
					this.getProfileData(this)
				}

				if (res.status != 200) {
					throw Error("error while deleting skills")
				}
				else {
					this.getProfileData(this)
				}

			})
			.catch(err => console.log(err))
	}

	render() {
		const {
			dataLoaded,
			skillSearchOpen,
			data,
			openLayerAt,
			shouldShowAllSkills
		} = this.state
		return (
			this.props.userLoaded ?
				skillSearchOpen ?
					<div className="profile">
						<SkillSearch handleEdit={this.editSkill} />
						<div className="back-btn" onClick={this.toggleSkillsSearch}></div>
					</div>
					:
					<div className="profile">
						<BasicProfile
							openLayerAt={openLayerAt}
							shouldShowAllSkills={shouldShowAllSkills}
							checkLogin={this.checkAndOpenLogin}
							editSkill={this.editSkill}
							deleteSkill={this.deleteSkill}
							setLastSortedBy={this.props.setLastSortedBy}
							lastSortedBy={this.props.lastSortedBy} />
						<div className="profile-actions">
							<div className="add-skill-btn" onClick={this.toggleSkillsSearch}></div>
							<div className="edit-skill-btn" onClick={this.toggleSkillsEdit}></div>
						</div>
					</div>
				: null
		)
	}
}
function mapStateToProps(state) {
	return {
		userLoaded: state.user.userLoaded,
		lastSortedBy: state.lastSortedBy
	}
}
export default connect(mapStateToProps, { getUserProfileData, toggleSkillsEditMode, editSkill, setLastSortedBy })(MyProfile)
