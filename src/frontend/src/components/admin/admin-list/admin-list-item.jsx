import React from 'react'
import AdminListItemHeader from './admin-list-item-header'
import AdminEditor from '../admin-editor/admin-editor'

export default class AdminListItem extends React.Component {
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
		console.log('I\'m saving something!!')
	}

	handleEdit() {
		this.setState({ isEditActive: true })
	}

	handleDelete() {
		console.log('delete')
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
