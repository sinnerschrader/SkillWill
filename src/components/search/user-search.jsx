import React from 'react'
import SearchBar from './search-bar.jsx'
import Results from './results/results.jsx'
import Dropdown from '../dropdown/dropdown.jsx'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'
import User from '../user/user.jsx'
import config from '../../config.json'
import { Router, Route, Link, browserHistory } from 'react-router'

export default class UserSearch extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			results: [],
			locationTerm: this.props.location.query.location || '',
			dropdownLabel: "Alle Standorte",
			searchItems: [],
			searchStarted: false,
			shouldUpdate: false,
			route: this.props.location.pathname
		}
		this.toggleUpdate = this.toggleUpdate.bind(this)
		this.requestSearch = this.requestSearch.bind(this)
		this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
		this.setInitialStateFromURL()
	}
	setInitialStateFromURL(){
		if(typeof this.props.location.query.skills != 'undefined'){
			const query = this.props.location.query.skills
			const location = this.props.location.query.location
			const dropdownLabel = typeof location != 'undefined' ? location : 'Alle Standorte'
			const queryArray = this.convertQueryParamsToArray(this.props.location.query.skills)
			const locationString = this.convertLocationToString(location)
			this.setState({
				searchItems: queryArray,
				locationString: locationString,
				dropdownLabel: dropdownLabel
			})
			this.requestSearch(this.state.searchItems, this.state.locationString)
			this.handleDropdownSelect(location)
		}
	}
	convertQueryParamsToArray(query){
		if (typeof query != 'undefined' && query.length !== 0){
			return query.split(',')
		} else {
			return []
		}
	}
	convertLocationToString(location){
		if (typeof location != 'undefined'){
			return `&location=${this.props.location.query.location}`
		} else {
			return ''
		}
	}
	requestSearch(searchTerms, locationString = this.state.locationTerm){
		fetch(`${config.backendServer}/users?skills=${searchTerms}${locationString}`)
		.then(r => {
			if (r.status === 400) {
				this.setState({
					results: [],
					searchItems: searchTerms,
					searchStarted: true,
					shouldUpdate: true
				})
			} else {
				r.json().then(data => {
						this.setState({
							results: data,
							searchStarted: true,
							searchItems: searchTerms,
							route: `search?skills=${searchTerms}${locationString}`,
							shouldUpdate: true
						})
				})
			}
		})
		.catch(error => {
				console.error(`requestSearch:${error}`)
		})
	}

	handleDropdownSelect(val) {
		if (val != "all" && typeof val != 'undefined') {
			this.setState({
				locationTerm: `&location=${val}`,
				dropdownLabel: val,
				searchStarted: true
			})
		} else {
			this.setState({
				locationTerm: "",
				dropdownLabel: "Alle Standorte"
			})
		}
		if (this.state.searchStarted) {
			this.requestSearch(this.state.searchItems, this.state.locationTerm)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const {route} = this.state
		const prevSearchString = `search${prevProps.location.search}`
		document.SearchBar.SearchInput.focus()
		if (prevSearchString != route) {
			this.context.router.push(route)
		}
	}

	// update component only if search has changed
	shouldComponentUpdate(nextProps, nextState) {
		const {searchItems, shouldUpdate} = this.state
		const haveSearchItemsChanged = searchItems.length != nextState.searchItems.length
		if (nextState.shouldUpdate){
			return true
		}
		return false
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
				{this.renderResults(searchStarted, results, searchItems)}
				{this.props.children}
			</div>
		)
	}
}
