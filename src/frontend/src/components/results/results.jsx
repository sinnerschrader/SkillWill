import React from 'react'
import ReactDOM from 'react-dom'
import config from '../../config.json'
import getStateObjectFromURL from '../../utils/getStateObjectFromURL'
import User from '../user/user'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { filterUserList, sortUserList } from '../../actions'
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
			results: { searched },
			sortedUsers: { sortedUsers: userResults },
			sortUserList,
			filterUserList
		} = this.props
		if (userResults && userResults.length > 0) {
			return (
				<div className="results-container animateable">
					<a className="counter" onClick={this.scrollToResults}>
						<span>{userResults.length} Ergebnisse</span>
					</a>
					<ul className="results">
						<ul className="sort-buttons">
							<li className="sort-button sort-button-name" onClick={() => sortUserList('lastName')}>
								<span className="sort-button-label">Sort by Name</span>
							</li>
							<li className="sort-button sort-button-location" onClick={() => sortUserList('location')}>
								<span className="sort-button-label">Sort by Location</span>
							</li>
							<li className="sort-button sort-button-fitness" onClick={() => sortUserList('fitness')}>
								<span className="sort-button-label">Sort by Match</span>
							</li>
						</ul>
						{userResults.map((user, i, array) => {
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
		sortedUsers: state.sortedAndFilteredUsers
	}
}
export default connect(mapStateToProps, { sortUserList })(Results)