import React from 'react'
import Icon from '../../icon/icon'

export default class AdminEditor extends React.Component {
	render() {
		return (
			<div className="admin-editor">
				<input
					id="title"
					className="textfield textfield--xlarge"
					defaultValue={this.props.skill}
					placeholder="Title"
				/>

				<label htmlFor="description">Skill-Definition</label>
				<textarea
					id="description"
					className="textfield"
					rows="3"
					placeholder="Please enter description of the skill."
				/>

				<label htmlFor="linked">Linked skills</label>
				<input
					id="linked"
					className="textfield"
					placeholder="Skills separated by comma"
				/>

				<div className="admin__control">
					<button
						className="admin__button admin__button--has-label"
						onClick={this.props.handleAbort}>
						<Icon name="cross" width={19} height={19} />Abort
					</button>
					<button
						className="admin__button admin__button--has-label"
						onClick={this.props.handleSave}>
						<Icon name="checkmark" width={19} height={19} />Save
					</button>
				</div>
			</div>
		)
	}
}
