import React from 'react'
import config from '../../config.json'
import User from '../user/user'
import Dropdown from '../dropdown/dropdown.jsx'
import TicketNotice from '../search/ticket-notice/ticket-notice'
import { connect } from 'react-redux'
import {
	setLocationFilter,
	setSortFilter,
	setDirectionFilter,
	stopAnimating,
} from '../../actions'
import sortAndFilter from '../../utils/sortAndFilter.js'

class Results extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lastSortedBy: 'fitness',
		}
		this.filterUserByLocation = this.filterUserByLocation.bind(this)
	}

	componentDidMount() {
		this.node.addEventListener('animationend', () => {
			if (this.props.isSkillAnimated) {
				this.props.stopAnimating()
			}
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
		const {
			directionFilter,
			locationFilter,
			lastSortedBy: { sortFilter },
			results: { searched, users },
			animated,
			setSortFilter,
			setDirectionFilter,
			searchTerms
		} = this.props
		const { directionFilterOptions, sortFilterOptions } = config
		if (users && users.length > 0) {
			const sortedUserList = sortAndFilter(
				users,
				sortFilter,
				directionFilter,
				locationFilter
			)
			return (
				<div ref={(ref) => { this.node = ref }} className={`results-container ${animated ? 'animateable' : ''}`}>
					<div className="counter">
						{sortedUserList.length} results, sorted
						<Dropdown
							onDropdownSelect={setDirectionFilter}
							dropdownLabel={directionFilter}
							options={directionFilterOptions}
						/>
						by
						<Dropdown
							onDropdownSelect={setSortFilter}
							dropdownLabel={sortFilter}
							options={sortFilterOptions}
						/>
					</div>
					<div className="results-legend-wrapper">
						<div className="results-legend container">
							<div className="results-legend-item name">Name</div>
							<div className="results-legend-item location">Location</div>
							<div className="results-legend-item skills">
								<div className="skill-label">Skill</div>
								<div className="skill-level">Skill level</div>
								<div className="will-level">Will level</div>
							</div>
						</div>
					</div>
					<div className="results">
						<ul className="results-list container">
							{sortedUserList.map(user => {
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
		} else if (!users || searchTerms.length == 0) {
			return (
				<div
					ref={(ref) => { this.node = ref }}
					className="no-results-container-border"
					data-isEmptyLabel={this.props.noResultsLabel}
				/>
			)
		} else {
			return (
				<div
					ref={(ref) => { this.node = ref }}
					className="no-results-container"
					data-isEmptyLabel={this.props.noResultsLabel}>
					<div className="container">
						<TicketNotice
							title={`Sorry, we haven't found a matching colleague.`}
							subtitle="Submit a suggestion!"
						/>
					</div>
				</div>
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
		directionFilter: state.directionFilter,
		isSkillAnimated: state.isSkillAnimated,
	}
}
export default connect(mapStateToProps, {
	setLocationFilter,
	setSortFilter,
	setDirectionFilter,
	stopAnimating,
})(Results)
