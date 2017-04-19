import React from 'react'
import config from '../../config.json'
import getStateObjectFromURL from '../../utils/getStateObjectFromURL'
import User from '../user/user'

export default class Results extends React.Component {
	constructor(props) {
		super(props)
		const {searchItems, locationString, dropdownLabel} = getStateObjectFromURL(this.props.location.query)
		 this.state = {
			searchItems,
			locationString,
			dropdownLabel,
			lastSortedBy: 'fitness',
			results: [],
			locationTerm: this.props.location.query.location || '',
			searchStarted: false,
			shouldUpdate: false,
			route: this.props.location.pathname
		};
		this.scrollToResults = this.scrollToResults.bind(this)
		this.sortResults = this.sortResults.bind(this)
		this.requestSearch = this.requestSearch.bind(this)
		this.requestSearch(searchItems, locationString)
	}

	componentDidMount(){
	}

	scrollToResults() {
		const searchbarRect = document.querySelector('.searchbar').getBoundingClientRect()
		window.scrollBy({ top: `${searchbarRect.top-10}`, behavior: "smooth"})
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

	sortResults(criterion){
		let sortedResults
		const {results, sortOrder} = this.state
		if (this.state.lastSortedBy === criterion) {
			sortedResults = results.reverse()
		} else if (criterion === 'fitness') {
			sortedResults = results.sort((a,b) => {
				return a[criterion] > b[criterion] ? -1 : 1
			})
		} else {
			sortedResults = results.sort((a,b) => {
				return a[criterion] < b[criterion] ? -1 : 1
			})
		}
		this.forceUpdate()

		this.setState({
			sortOrder: sortOrder,
			lastSortedBy: criterion,
			results: sortedResults
		})
	}

	render() {
		const { results } = this.state
		if (results.length > 0) {
			return(
				<div class="results-container">
					<a class="counter" onClick={this.scrollToResults}>
						<span>{results.length} Ergebnisse</span>
					</a>
					<ul class="results">
						<ul class="sort-buttons">
						<li class="sort-button-name" onClick={() => this.sortResults('name')}>Sort by Name</li>
						<li class="sort-button-location" onClick={() => this.sortResults('location')}>Sort by Location</li>
						<li class="sort-button-fitness" onClick={() => this.sortResults('fitness')}>Sort by Fitness</li>
						</ul>
						{results.map((data, i) => {
							return (
								<li class="result-item" key={i}>
									<User data={data} searchTerms={this.state.searchItems}/>
							</li>
							)
						})}
					</ul>
				</div>
			)
		}
		else {
			return (
				<div class="results-container" data-isEmptyLabel={this.props.noResultsLabel}></div>
			)
		}
	}
}

