import React from 'react'
import SearchBar from './search-bar.jsx'
import Results from '../results/results.jsx'
import Skill from '../skill/skill.jsx'
import config from '../../config.json'

export default class SkillSearch extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			results: null,
			searchItems: [],
			searchStarted: false,
			shouldUpdate: false
		}
		this.toggleUpdate = this.toggleUpdate.bind(this)
		this.requestSearch = this.requestSearch.bind(this)
	}

	requestSearch(searchTerms) {

		fetch(`${config.backendServer}/skills?search=${searchTerms}`)
			.then(r => {
				r.json().then(data => {
					this.setState({
						results: data,
						searchStarted: true,
						searchItems: searchTerms,
						shouldUpdate: true
					})
				})
			})
			.catch(error => {
				console.error("requestSearch" + error)
				this.setState({ results: null })
			})
	}

	// update component only if search has changed
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.shouldUpdate && ((this.state.results !== nextState.results) || (this.state.searchItems.length !== nextState.searchItems.length))) {
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
		if (searchStarted) {
			return (
				<Results results={results} searchTerms={searchItems} noResultsLabel={"Keinen passenden Skill gefunden?"}>
					<Skill handleEdit={this.props.handleEdit} userData={this.props.data} />
				</Results>
			)
		}
	}


	render() {
		const { results, searchItems, searchStarted } = this.state
		return (
			<div class="searchbar">
				<p class="subtitle">Neuen Skill hinzufügen</p>
				<p class="search-description">Suche nach Skills, die Du auf Deinem Profil zeigen möchtest</p>
				<SearchBar
					handleRequest={this.requestSearch}
					toggleUpdate={this.toggleUpdate}
					parent={this}
					searchTerms={searchItems} />
				{this.renderResults(searchStarted, results, searchItems)}
			</div>
		)
	}
}
