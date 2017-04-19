import React from 'react'
import SearchBar from './search-bar.jsx'
import Dropdown from '../dropdown/dropdown.jsx'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'
import User from '../user/user.jsx'
import getStateObjectFromURL from '../../utils/getStateObjectFromURL'

export default class UserSearch extends React.Component {
	constructor(props) {
		super(props)
		const {searchItems, locationString, dropdownLabel} = getStateObjectFromURL(this.props.location.query)
		this.state = {
			searchItems,
			locationString,
			dropdownLabel,
			results: [],
			searchStarted: false,
			shouldUpdate: false,
			route: this.props.location.pathname,
		}
		console.log('props',this.props)
		console.log('searchitems',this.state.searchItems)
		this.toggleUpdate = this.toggleUpdate.bind(this)
		this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
	}



	handleDropdownSelect(val) {
		if (val !== "all" && typeof val !== 'undefined') {
			console.log('this.props.onDropdownSelect')
			this.setState({
				locationString: `&location=${val}`,
				dropdownLabel: val,
				searchStarted: true
			})
		} else {
			this.setState({
				locationString: "",
				dropdownLabel: "Alle Standorte"
			})
		}
		// if (this.state.searchStarted) {
		// 	this.requestSearch(this.state.searchItems, this.state.locationTerm)
		// }
	}

	componentDidUpdate(prevProps, prevState) {
		const {route, searchItems, locationString} = this.state
		console.log('state',this.state)
		const newRoute = route + searchItems + locationString
		const prevSearchString = `search${prevProps.location.search}`
		document.SearchBar.SearchInput.focus()
		if (prevSearchString !== newRoute) {
			this.context.router.push(newRoute)
		}
	}

	toggleUpdate(bool) {
		this.setState({
			shouldUpdate: bool
		})
	}
	renderResults(searchStarted, results, searchItems) {
		/* display Results component only when there has been an inital search */
		if (results && results.length > 0){
			return(
				<Results
					results={results}
					searchTerms={searchItems}
					noResultsLabel={"Keine Ergebnisse"}>
					<User searchTerms={searchItems}/>
				</Results>
			)
		} else {
			return(
				<div class="info-text">
					Du bist auf der Suche nach speziellen Talenten oder Personen mit bestimmten Skills bei SinnerSchrader?
					Dann gib Deinen Suchbegriff ein und Du bekommst eine Liste mit potentiellen Kandidaten angezeigt.
				</div>
			)
		}
	}
	render() {
		const {results, dropdownLabel, searchItems, searchStarted} = this.state
		return(
			<div class="searchbar">
				<Dropdown
					onDropdownSelect={this.handleDropdownSelect}
					dropdownLabel={dropdownLabel}/>
				<SearchBar
					handleRequest={this.requestSearch}
					toggleUpdate={this.toggleUpdate}
					parent={this}
					searchTerms={searchItems}
					noResults={results.length === 0}>
					<SearchSuggestions
						searchTerms={searchItems}
						noResults={results.length === 0}/>
				</SearchBar>
				{/*{this.renderResults(searchStarted, results, searchItems)}*/}
				{this.props.children}
			</div>
		)
	}
}
