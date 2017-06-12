import React from 'react'
import ReactDOM from 'react-dom'
import config from '../../config.json'
import User from '../user/user'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { setLocationFilter, setSortFilter } from '../../actions'
import sortAndFilter from '../../utils/sortAndFilter.js'

class Results extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lastSortedBy: 'fitness'
		}
		this.scrollToResults = this.scrollToResults.bind(this)
		this.filterUserByLocation = this.filterUserByLocation.bind(this)
		this.removeAnimationClass = this.removeAnimationClass.bind(this)
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this).addEventListener('animationend', this.removeAnimationClass)
	}

	removeAnimationClass() {
		ReactDOM.findDOMNode(this).classList.remove('animateable')
		ReactDOM.findDOMNode(this).removeEventListener('animationend', this.removeAnimationClass)
	}

	scrollToResults() {
		const searchbarRect = document.querySelector('.searchbar').getBoundingClientRect()
		window.scrollBy({ top: `${searchbarRect.top - 10}`, behavior: "smooth" })
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
		const {
			locationFilter,
			lastSortedBy : {sortFilter, lastSortedBy},
			results: { searched, users },
			setSortFilter
		} = this.props
		if (users && users.length > 0) {
		const sortedUserList = sortAndFilter(users, sortFilter, 'desc', locationFilter)
			return (
				<div className="results-container animateable">
					<a className="counter" onClick={this.scrollToResults}>
						<span>{sortedUserList.length} Ergebnisse</span>
					</a>
					<ul className="results">
						<ul className="sort-buttons">
							<li className="sort-button sort-button-name" onClick={() => setSortFilter('lastName')}>
								<span className="sort-button-label">Sort by Name</span>
							</li>
							<li className="sort-button sort-button-location" onClick={() => setSortFilter('location')}>
								<span className="sort-button-label">Sort by Location</span>
							</li>
							<li className="sort-button sort-button-fitness" onClick={() => setSortFilter('fitness')}>
								<span className="sort-button-label">Sort by Match</span>
							</li>
						</ul>
						{sortedUserList.map((user, i, array) => {
							return (
								<li className="result-item" key={user.id}>
									<User
										user={user}
										prevUser={array[i - 1]}
										nextUser={array[i + 1]}
										searchTerms={searched} />
								</li>
							)
						})}
					</ul>
				</div>
			)
		}
		else {
			return (
				<div className="results-container" data-isEmptyLabel={this.props.noResultsLabel}></div>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		results: state.results,
		searchTerms: state.searchTerms,
		locationFilter: state.locationFilter,
		lastSortedBy: state.lastSortedBy
	}
}
export default connect(mapStateToProps, { setLocationFilter, setSortFilter })(Results)