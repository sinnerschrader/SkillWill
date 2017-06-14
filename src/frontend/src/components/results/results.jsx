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
		this.showUnavailableSearchTerms = this.showUnavailableSearchTerms.bind(this)
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this).addEventListener('animationend', this.removeAnimationClass)
		document.body.classList.add('results-view')
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

	showUnavailableSearchTerms(){
		const {searchTerms, results: {input}} = this.props
		return searchTerms.filter(term => input.indexOf(term) === -1)
	}

	render() {
		const {
			searchTerms,
			directionFilter,
			locationFilter,
			lastSortedBy: { sortFilter, lastSortedBy },
			results: { searched, users },
			setSortFilter,
			setDirectionFilter
		} = this.props
		const { directionFilterOptions, sortFilterOptions } = config
		if (users && users.length >= 0) {
			const notFound = this.showUnavailableSearchTerms()
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
							{notFound && notFound.length > 0 ? <div> {notFound} konnte nicht gefunden werden	</div> : ""}
					</div>
					<div className="results-legend-wrapper">
						<div className="results-legend container">
							<div className="results-legend-item name">Name</div>
							<div className="results-legend-item location">Standort</div>
							<div className="results-legend-item skills">
								<div className="skill-label">Skill</div>
								<div className="skill-level">Skill level</div>
								<div className="will-level">Will level</div>
							</div>
						</div>
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