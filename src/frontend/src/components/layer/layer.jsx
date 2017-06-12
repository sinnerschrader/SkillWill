import React from 'react'
import { Router, Link, browserHistory } from 'react-router'
import { exitSkillsEditMode } from '../../actions'
import { connect } from 'react-redux'

class Layer extends React.Component {
	constructor(props) {
		super(props)
		this.handleClose = this.handleClose.bind(this)
	}

	handleClose() {
		//return to home if current page is login
		browserHistory.push("/")
		document.body.classList.remove('layer-open')
		this.props.exitSkillsEditMode()
	}

	render() {
		return (
			<div className="layer-container">
				<Link onClick={this.handleClose} className="close-layer"></Link>
				<Link onClick={this.handleClose} className="close-btn"></Link>
				<div className="layer">
					{this.props.children}
				</div>
			</div>
		)
	}
}

export default connect(null, { exitSkillsEditMode })(Layer)
