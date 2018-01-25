import React from 'react'
import BasicProfile from './basic-profile.jsx'
import { getUserProfileData, clearUserData } from '../../actions'
import { connect } from 'react-redux'

class OthersProfile extends React.PureComponent {

	componentWillMount = () => {
		const userId = this.props.params.id || 'id'
		this.props.getUserProfileData(userId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.id !== this.props.params.id) {
			this.props.getUserProfileData(nextProps.params.id)
		}
	}

	render() {
		const { user } = this.props
		return user.loaded ? (
			<div className="profile">
				<BasicProfile user={user} renderSearchedSkills={true} />
			</div>
		) : null
	}
}
function mapStateToProps(state) {
	const { user } = state
	return {
		user
	}
}

export default connect(mapStateToProps, {
	getUserProfileData,
	clearUserData
})(OthersProfile)
