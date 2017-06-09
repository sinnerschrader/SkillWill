import React from 'react'
import { Router, Route, Link } from 'react-router'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'

export default class SearchBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentValue: '',
		}
		this.getInputValue = this.getInputValue.bind(this)
		this.deleteFilter = this.deleteFilter.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this)
	}

	componentDidMount() {
		this.input.focus()
	}

	getInputValue(event) {
		this.setState({
			currentValue: event.target.value
		})
	}

	deleteFilter(event, deleteItem) {
		const { searchTerms } = this.props
		const { currentValue } = this.state
		const { key, type, target } = event
		const isBackspaceKey = currentValue === "" && key === 'Backspace' && searchTerms !== ""
		const isMouseClick = type === 'click' && target.dataset.filter === deleteItem

		if (isBackspaceKey || isMouseClick) {
			this.props.onInputDelete(deleteItem)
		}
	}

	handleSubmit(event) {
		event.preventDefault()
		const regex = new RegExp(/\s*,+\s*/, 'g')
		const currentValue = this.state.currentValue.trim().split(regex).filter(element => element)
		if (currentValue) {
			this.props.onInputChange(currentValue)
		}
			this.setState({
			currentValue: ''
		})
	}

	handleSuggestionSelected(name) {
		this.setState({
			searchTerms: this.state.searchTerms.concat(name),
			currentValue: ''
		})
	}

	render() {
		const { searchTerms } = this.props
		return (
			<div>
				<form
					onSubmit={this.handleSubmit}
					name="SearchBar"
					autoComplete="off">
					<div className="search-container">
						<div className="input-container">
							{/*display entered searchTerms in front of the input field*/}
							{searchTerms.map((searchTerm, i) => {
								return (
									<div className="search-term" key={searchTerm}>
										{searchTerm}
										<a className="close" data-filter={searchTerm} key={`delete_${searchTerm}`} onClick={event => this.deleteFilter(event, searchTerm)}>&#9747;</a>
									</div>
								)
							})}
							<input
								name="SearchInput"
								autoComplete="off"
								spellCheck="false"
								placeholder="Suche nach gewünschtem Skill"
								type="search"
								value={this.state.currentValue}
								autoFocus="true"
								onChange={this.getInputValue}
								onKeyDown={event => this.deleteFilter(event, searchTerms.slice(-1)[0])}
								ref={input => { this.input = input }}>
							</input>
						</div>
						<button type="submit" className="submit-search-button" />
					</div>
				</form>
			</div>
		)
	}
}
