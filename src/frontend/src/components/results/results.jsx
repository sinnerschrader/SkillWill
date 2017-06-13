import React from 'react'
import ReactDOM from 'react-dom'
import config from '../../config.json'
import User from '../user/user'
import Dropdown from '../dropdown/dropdown.jsx'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { setLocationFilter, setSortFilter, setDirectionFilter } from '../../actions'
import sortAndFilter from '../../utils/sortAndFilter.js'

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
			directionFilter,
			locationFilter,
			lastSortedBy: { sortFilter, lastSortedBy },
			results: { searched, users },
			setSortFilter,
			setDirectionFilter
		} = this.props
		const directionFilterOptions = [
			{ value: "ascending", display: "aufsteigend" },
			{ value: "descending", display: "absteigend" }
		]
		const sortFilterOptions = [
			{ value: "fitness", display: "Match" },
			{ value: "lastName", display: "Name" },
			{ value: "location", display: "Standort" }
		]
		if (users && users.length > 0) {
			const sortedUserList = sortAndFilter(users, sortFilter, directionFilter, locationFilter)
			return (
				<div className="results-container animateable">
					<div className="counter">
						{sortedUserList.length} Ergebnisse, sortiert
							<Dropdown
							onDropdownSelect={setDirectionFilter}
							dropdownLabel={directionFilter}
							options={directionFilterOptions} />
						nach
							<Dropdown
							onDropdownSelect={setSortFilter}
							dropdownLabel={sortFilter}
							options={sortFilterOptions} />
					</div>
					<div className="results">
						<ul className="results-list container">
							{sortedUserList.map((user, i) => {
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
		lastSortedBy: state.lastSortedBy,
		directionFilter: state.directionFilter
	}
}
export default connect(mapStateToProps, { setLocationFilter, setSortFilter, setDirectionFilter })(Results)