import React from 'react'
import { Router, Link, browserHistory } from 'react-router'
import BasicProfile from "./basic-profile.jsx"
import config from '../../config.json'
import SkillItem from '../skill-item/skill-item.jsx'
import { getUserProfileData } from '../../actions'
import sortAndFilter from '../../utils/sortAndFilter.js'

import { connect } from 'react-redux'

class OthersProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userId: this.props.params.id || "id",
			dataLoaded: true,
			infoLayerAt: 0
		}
		this.findIndexByUserId = this.findIndexByUserId.bind(this)
		this.props.getUserProfileData(this.state.userId)
	}

	componentWillReceiveProps(nextProps){
		if (this.state.userId !== nextProps.params.id){
			this.setState({
				userId: nextProps.params.id
			})
			this.props.getUserProfileData(nextProps.params.id)
		}
	}

	findIndexByUserId(userId, userList){
		return userList.findIndex((user) => {
			if (user['id'] === userId){
				return true
			}
		})
	}

	render() {
		let sortedUserList
		let userIndex
		let prevUser
		let nextUser

		const {
			locationFilter,
			lastSortedBy: { sortFilter, lastSortedBy },
			results: { searched, users },
			setSortFilter
		} = this.props
		const {userId} = this.state
		if (users && users.length > 0) {
			sortedUserList = sortAndFilter(users, sortFilter, 'desc', locationFilter)
			userIndex = this.findIndexByUserId(userId, sortedUserList)
			prevUser = sortedUserList[userIndex-1]
			nextUser = sortedUserList[userIndex+1]
		}
			return (
				this.props.userLoaded ?
					<div className="profile">
						<BasicProfile
							renderSearchedSkills={true}/>
					{prevUser ?
					<Link
						to={`/profile/${prevUser['id']}`}
						activeClassName="active"
						className="link link_prevUser"
						id={prevUser['id']}>{prevUser['id']}	</Link>
						: null}
					{nextUser ?
					<Link
						to={`/profile/${nextUser['id']}`}
						activeClassName="active"
						className="link link_nextUser"
						id={nextUser['id']}>{nextUser['id']}	</Link>
						: null}
					</div>
					: null
			)
	}
}

function mapStateToProps(state) {
	return {
		userLoaded: state.user.userLoaded,
		results: state.results,
		locationFilter: state.locationFilter,
		lastSortedBy: state.lastSortedBy
	}
}

export default connect(mapStateToProps, { getUserProfileData })(OthersProfile)