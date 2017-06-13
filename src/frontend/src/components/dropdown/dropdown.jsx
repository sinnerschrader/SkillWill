import React from 'react'

export default class Dropdown extends React.Component {
	constructor(props) {
		super(props)

		this.handleDropdownChange = this.handleDropdownChange.bind(this)
		this.setDropdownLabel = this.setDropdownLabel.bind(this)
		this.renderOptions = this.renderOptions.bind(this)
	}

	handleDropdownChange(e) {
		const value = e.target.value
		this.props.onDropdownSelect(value)
	}

	setDropdownLabel() {
		const { dropdownLabel, options } = this.props
		const findOption = options.find(option => {
			return option['value'] === dropdownLabel
		})
		return findOption['display']

	}

	renderOptions() {
		const { options, dropdownLabel } = this.props
		return options.map(option => {
			return (
				<option
					key={`${option["value"]}`}
					value={`${option["value"]}`}
				>{`${option["display"]}`}</option>
			)
		})
	}

	render() {
		const { options } = this.props
		return (
			<div className="dropdown">
				<span className="dropdown-label">{this.setDropdownLabel()}</span>
				<select
					onChange={this.handleDropdownChange}
					value={this.props.dropdownLabel}>
					{this.renderOptions()}
				</select>
			</div>
		)
	}
}


