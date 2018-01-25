import React from 'react'
import { Link, browserHistory } from 'react-router'
import { exitSkillsEditMode, getUserProfileData } from '../../actions'
import Icon from '../icon/icon.jsx'
import { connect } from 'react-redux'

class Layer extends React.Component {
	constructor(props) {
		super(props)
		this.handleClose = this.handleClose.bind(this)
	}

	componentDidMount() {
		document.body.classList.add('layer-open')
	}

	componentWillUnmount() {
		document.body.classList.remove('layer-open')
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

		let counter = arr.indexOf(this.props.params.id)

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

		let counter = arr.indexOf(this.props.params.id)

		let prevProfile = arr[counter - 1]
		if (prevProfile === undefined) {
			prevProfile = arr[0]
		}

		return prevProfile
	}

	shouldArrowsBeShown(users) {
		const inMyProfile = this.props.location.pathname.indexOf('my-profile')

		if (inMyProfile < 0 && users !== undefined) {
			return true
		}
		return false
	}

	render() {
		const { results: { users }} = this.props

		return (
			<div className="layer-container" name="containerid">
				<Link onClick={this.handleClose} className="close-layer" />

				<div className="btn-wrapper">
					<div className={this.shouldArrowsBeShown(users) ? "layer-btns" : "no-btns"}>
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
