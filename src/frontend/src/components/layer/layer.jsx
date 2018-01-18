import React from 'react'
import { Link, browserHistory } from 'react-router'
import { exitSkillsEditMode, getUserProfileData } from '../../actions'
import Icon from '../icon/icon.jsx'
import { connect } from 'react-redux'

class Layer extends React.Component {
	constructor(props) {
		super(props)
		this.handleClose = this.handleClose.bind(this)

		this.state = {
			userId: this.props.params.id || "id"
		}
		this.props.getUserProfileData(this.state.userId)
	}

	componentDidMount() {
		document.body.classList.add('layer-open')
	}

	componentWillUnmount() {
		document.body.classList.remove('layer-open')
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			userId: nextProps.params.id
		})
		if (nextProps.params.id !== nextProps.user.id) {
			this.props.getUserProfileData(this.state.userId)
		}
	}

	handleClose() {
		// @todo: refactor for edge cases (e.g. admin interface)
		browserHistory.push("/")

		document.body.classList.remove('layer-open')

		this.props.exitSkillsEditMode()
	}

	getNextUserId(users) {
		let arr = []

		for (let x in users) {
			arr.push(users[x].id)
		}

		let counter = arr.indexOf(this.state.userId)

		let nextProfile = arr[counter + 1]
		if (nextProfile === undefined) {
			nextProfile = arr[0]
		}
		return nextProfile
	}

	getPrevUserId(users) {
		let arr = []

		for (let x in users) {
			arr.push(users[x].id)
		}

		let counter = arr.indexOf(this.state.userId)

		let prevProfile = arr[counter - 1]
		if (prevProfile === undefined) {
			prevProfile = arr[0]
		}

		return prevProfile
	}

	profileChecker() {
		const inMyProfile = this.props.location.pathname.indexOf('my-profile')

		if (inMyProfile < 0) {
			return true
		}
	}

	render() {
		// const { results: { users }} = this.props

		return (
			<div className="layer-container" name="containerid">
				<Link onClick={this.handleClose} className="close-layer" />

				<div className="btn-wrapper">
					<div className={this.profileChecker() ? "layer-btns" : "no-btns"}>
						<Link className="previous-arrow" to={`/profile/${this.getPrevUserId(users)}`} />
						<Link className="next-arrow" to={`/profile/${this.getNextUserId(users)}`} />
					</div>

				<div className="layer">
					<Link onClick={this.handleClose} className="close-btn">
						<Icon name="cross" size={22} />
					</Link>
					{this.props.children}
				</div>

				</div>

			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		results: state.results,
		user: state.user
	}
}

export default connect(mapStateToProps, { exitSkillsEditMode, getUserProfileData })(Layer)
