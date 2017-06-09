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
					<div className="counter">
						{filteredUser.length} Ergebnisse, sortiert
						<div className="dropdown">
							<span className="dropdown-label">aufsteigend</span>
							<select>
								<option value="all">???</option>
							</select>
						</div>
						nach
						<div className="dropdown">
							<span className="dropdown-label">Match</span>
							<select>
								<option value="all">???</option>
							</select>
						</div>
					</div>
					<div className="results">
						<div className="sort-buttons-wrapper">
							<div className="container">
								<ul className="sort-buttons">
									<li className="sort-button sort-button-name" onClick={() => this.sortResults('lastName')}>
										<span className="sort-button-label">Sort by Name</span>
									</li>
									<li className="sort-button sort-button-location" onClick={() => this.sortResults('location')}>
										<span className="sort-button-label">Sort by Location</span>
									</li>
									<li className="sort-button sort-button-fitness" onClick={() => this.sortResults('fitness')}>
										<span className="sort-button-label">Sort by Fitness</span>
									</li>
								</ul>
							</div>
						</div>
						<ul className="results-list container">
							{filteredUser.map((user, i) => {
								return (
									<li className="result-item" key={user.id}>
										<User user={user} searchTerms={searched} />
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="no-results-container" data-isEmptyLabel={this.props.noResultsLabel}></div>
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