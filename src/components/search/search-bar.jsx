 import React from 'react'
 import { Router, Route, Link } from 'react-router'
 import SearchSuggestions from './search-suggestion/search-suggestions.jsx'

export default class SearchBar extends React.Component {
		constructor(props) {
				super(props)
				this.state = {
						currentValue: '',
						searchTerms: this.props.searchTerms
				}
				this.handleChange = this.handleChange.bind(this)
				this.handleKeyDown = this.handleKeyDown.bind(this)
				this.handleClose = this.handleClose.bind(this)
				this.handleSubmit = this.handleSubmit.bind(this)
				this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this)
		}

		handleChange(e) {
				this.setState({
						currentValue : e.target.value
				})
		}

		handleKeyDown(e) {
				//remove recently added searchTerm on Backspace
				if (this.state.currentValue == "" && e.keyCode == 8 && this.state.searchTerms != "") {
				this.setState ({
						searchTerms: this.state.searchTerms.slice(0,(this.state.searchTerms.length-1))
				})
				this.props.handleRequest(this.state.searchTerms)
				}
		}

		handleClose(name) {
				this.setState({
						searchTerms: this.state.searchTerms.filter(s => s !== name),
						currentValue: ''
				})
				this.props.handleRequest(this.state.searchTerms)
		}

		handleSubmit(e) {
				e.preventDefault()
				if (this.state.currentValue.length != 0) {
						this.setState({
								searchTerms: this.state.searchTerms.concat([this.state.currentValue]),
								currentValue : ""
						})
				}
				this.props.handleRequest(this.state.searchTerms)
				e.target.focus()
		}

		handleSuggestionSelected(name) {
				this.setState({
				searchTerms: this.state.searchTerms.concat(name),
				currentValue: ''
				})
				this.props.handleRequest(this.state.searchTerms)
		}

			// update component only if search has changed
		shouldComponentUpdate(nextProps, nextState) {
				return this.state != nextState || this.props != nextProps
		}

		render() {
			return (
				<div>
					<form onSubmit={this.handleSubmit} name="SearchBar" autocomplete="off">
						<div class="search-container">
							<div class="input-container">
								{/*display entered searchTerms in front of the input field*/}
								{this.state.searchTerms.map((searchTerm, i) => {
									return(
										<div class="search-term" >
											{searchTerm}
											<a class="close" key={i} onClick={this.handleClose.bind(null, searchTerm)}>&#9747;</a>
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
									onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}>
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
