import React from 'react'
import { Router, Route, Link } from 'react-router'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'
import getStateObjectFromURL from '../../utils/getStateObjectFromURL'

export default class SearchBar extends React.Component {
	constructor(props) {
		super(props)
		const { searchItems, locationString, dropdownLabel } = getStateObjectFromURL(this.props.queryParams)
		this.state = {
			searchItems,
			locationString,
			dropdownLabel,
			currentValue: '',
			searchTerms: this.props.searchTerms
		}
		this.getInputValue = this.getInputValue.bind(this)
		this.deleteOnBackSpacePress = this.deleteOnBackSpacePress.bind(this)
		this.closeOnXClick = this.closeOnXClick.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this)
	}

	componentDidMount() {
		this.input.focus();
	}

	getInputValue(e) {
		this.setState({
			currentValue: e.target.value
		})
	}

	deleteOnBackSpacePress(e) {
		//remove recently added searchTerm on Backspace
		if (this.state.currentValue == "" && e.keyCode == 8 && this.state.searchTerms !== "") {
			const deleteItem = this.state.searchTerms.slice(-1)
			this.props.onInputDelete(deleteItem)
		}
	}

	closeOnXClick(name) {
		this.props.onInputDelete(name)
	}

	handleSubmit(e) {
		e.preventDefault()
		this.props.onInputChange(this.state.currentValue)
	}

	handleSuggestionSelected(name) {
		this.setState({
			searchTerms: this.state.searchTerms.concat(name),
			currentValue: ''
		})
		// this.props.handleRequest(this.state.searchTerms)
	}

	render() {
		return (
			<div>
				<form
					onSubmit={this.handleSubmit}
					name="SearchBar"
					autocomplete="off">
					<div class="search-container">
						<div class="input-container">
							{/*display entered searchTerms in front of the input field*/}
							{this.state.searchTerms.map((searchTerm, i) => {
								return (
									<div class="search-term">
										{searchTerm}
										<a class="close" key={i} onClick={() => this.closeOnXClick(searchTerm)}>&#9747;</a>
									</div>
								)
							})}
							<input
								name="SearchInput"
								autocomplete="off"
								placeholder="Nach welchem Skill suchst du?"
								type="search"
								value={this.state.currentValue}
								autoFocus="true"
								onChange={this.getInputValue}
								onKeyDown={this.deleteOnBackSpacePress}
								ref={input => { this.input = input }}>
							</input>
						</div>
						<button type="submit" class="search" />
					</div>
				</form>
				{React.cloneElement(this.props.children, { handleSuggestionSelected: this.handleSuggestionSelected, currentValue: this.state.currentValue })}
			</div>
		)
	}
}
