import React from 'react'
import SearchBar from './search-bar.jsx'
import Dropdown from '../dropdown/dropdown.jsx'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'
import { getUserBySearchTerms, filterUserList } from '../../actions'
import { connect } from 'react-redux'

class UserSearch extends React.Component {
	constructor(props) {
		super(props)

		this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
		this.handleSearchBarInput = this.handleSearchBarInput.bind(this)
		this.handleSearchBarDelete = this.handleSearchBarDelete.bind(this)
	}

	handleSearchBarInput(newSearchTerms) {
		this.props.getUserBySearchTerms(newSearchTerms)
	}

	handleSearchBarDelete(deleteItem) {
		this.props.getUserBySearchTerms(deleteItem, 'delete')
	}

	handleDropdownSelect(location) {
			this.props.filterUserList(location)
	}

	render() {
		const { searchTerms, locationFilter } = this.props
		return (
			<div className="searchbar">
				<Dropdown
					onDropdownSelect={this.handleDropdownSelect}
					dropdownLabel={locationFilter} />
				<SearchBar
					onInputChange={this.handleSearchBarInput}
					onInputDelete={this.handleSearchBarDelete}
					searchTerms={searchTerms}>
					{/*<SearchSuggestions
						searchTerms={searchItems}
						noResults={results.length === 0} />*/}
				</SearchBar>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		searchTerms: state.searchTerms,
		locationFilter: state.locationFilter
	}
}

export default connect(mapStateToProps, { getUserBySearchTerms, filterUserList })(UserSearch)
