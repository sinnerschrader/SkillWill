import React from 'react'
import AdminListItemHeader from './admin-list-item-header'
import AdminEditor from '../admin-editor/admin-editor'
import { adminSkillAdd, adminSkillEdit, adminSkillDelete, getSkillsBySearchTerm } from '../../../actions'
import connect from 'react-redux/es/connect/connect'

class AdminListItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isEditActive: false }

		this.handleAbort = this.handleAbort.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}

	handleAbort() {
		this.setState({ isEditActive: false })
	}

	handleSave() {
		console.log('I\'m saving the edited skill')
		this.props.adminSkillEdit()
	}

	handleEdit() {
		this.setState({ isEditActive: true })
	}

	handleDelete() {
		console.log('deleting skill')
		this.props.adminSkillDelete()
	}

	render() {
		const { skill } = this.props
		const { isEditActive } = this.state

		return (
			<li className="admin-list__item">
				{isEditActive ? (
					<AdminEditor
						skill={skill}
						handleAbort={this.handleAbort}
						handleSave={this.handleSave}
					/>
				) : (
					<div>
						<AdminListItemHeader
							title={skill}
							handleDelete={this.handleDelete}
							handleEdit={this.handleEdit}
						/>

						<h4>Skill-Definition</h4>
						<p>Text</p>

						<h4>Linked skills</h4>
						<ul className="admin-list__linked">
							<li>Java ipsum</li>
							<li>Java lorem</li>
							<li>linked Skill 3</li>
							<li>linked Skill 4</li>
						</ul>
					</div>
				)}
			</li>
		)
	}
}

function mapStateToProps(state) {
	return { skillSearchTerms: state.skillSearchTerms }
}

export default connect(mapStateToProps, {
	getSkillsBySearchTerm,
	adminSkillAdd,
	adminSkillEdit,
	adminSkillDelete
})(AdminListItem)
