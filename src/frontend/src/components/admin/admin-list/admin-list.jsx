import React from 'react'
import { connect } from 'react-redux'
import AdminListItem from './admin-list-item'

class AdminList extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { skills } = this.props

		return (
			<ul className="admin-list">
				{skills.map((skill, index) => {
					return <AdminListItem skill={skill} key={index} />
				})}
			</ul>
		)
	}
}

function mapStateToProps(state) {
	return { skills: state.skills }
}

export default connect(mapStateToProps)(AdminList)
