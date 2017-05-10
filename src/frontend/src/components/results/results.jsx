import React from 'react'
import config from '../../config.json'
import getStateObjectFromURL from '../../utils/getStateObjectFromURL'
import User from '../user/user'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

class Results extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lastSortedBy: 'fitness'
		}
		this.scrollToResults = this.scrollToResults.bind(this)
		this.sortResults = this.sortResults.bind(this)
		this.filterUserByLocation = this.filterUserByLocation.bind(this)
	}

	scrollToResults() {
		const searchbarRect = document.querySelector('.searchbar').getBoundingClientRect()
		window.scrollBy({ top: `${searchbarRect.top - 10}`, behavior: "smooth" })
	}

	sortResults(criterion) {
		let sortedResults
		const { results: { user } } = this.props
		if (this.state.lastSortedBy === criterion) {
			sortedResults = results.reverse()
		} else if (criterion === 'fitness') {
			sortedResults = results.sort((a, b) => {
				return a[criterion] > b[criterion] ? -1 : 1
			})
		} else {
			sortedResults = results.sort((a, b) => {
				return a[criterion] < b[criterion] ? -1 : 1
			})
		}
		this.forceUpdate()

		this.setState({
			lastSortedBy: criterion,
			results: sortedResults
		})
	}

	filterUserByLocation(user) {
		const { locationFilter } = this.props
		if (locationFilter === 'all') {
			return true
		} else {
			return user.location === locationFilter
		}
	}

	render() {
		const { locationFilter, results: { user, searched } } = this.props
		if (user && user.length > 0) {
			return (
				<div class="results-container">
					<a class="counter" onClick={this.scrollToResults}>
						<span>{user.length} Ergebnisse</span>
					</a>
					<ul class="results">
						<ul class="sort-buttons">
							<li class="sort-button-name" onClick={() => this.sortResults('name')}>Sort by Name</li>
							<li class="sort-button-location" onClick={() => this.sortResults('location')}>Sort by Location</li>
							<li class="sort-button-fitness" onClick={() => this.sortResults('fitness')}>Sort by Fitness</li>
						</ul>
						{user.filter(this.filterUserByLocation).map((user, i) => {
							return (
								<li class="result-item" key={i}>
									<User user={user} searchTerms={searched} />
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

function mapStateToProps(state) {
	return {
		results: state.results,
		searchTerms: state.searchTerms,
		locationFilter: state.locationFilter
	}
}
export default connect(mapStateToProps)(Results)