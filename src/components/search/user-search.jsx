import React from 'react'
import SearchBar from './search-bar.jsx'
import Results from './results/results.jsx'
import Dropdown from '../dropdown/dropdown.jsx'
import SearchSuggestions from './search-suggestion/search-suggestions.jsx'
import User from '../user/user.jsx'
import config from '../../config.json'
import { Router, Route, Link, browserHistory } from 'react-router'

export default class UserSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      results: [],
      locationTerm: "",
      dropdownLabel: "Alle Standorte",
      searchItems: [],
      searchStarted: false,
      shouldUpdate: false,
      route: ""
    }
    this.toggleUpdate = this.toggleUpdate.bind(this)
    this.requestSearch = this.requestSearch.bind(this)
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)

    const queryTerms = this.props.params.searchTerms

    //Get searchTerm out of route queries
    if (queryTerms != undefined) {
      let set = new Set(this.props.params.searchTerms.split(','))
			let arr = Array.from(set)

      this.setState({
        searchItems: arr,
        shouldUpdate: true,
      })
      this.requestSearch(this, this.state.searchItems);
    }
  }

  requestSearch(e, searchTerms) {
    fetch(`${config.backendServer}/users?skills=${searchTerms}`)
    .then(r => {
      if (r.status === 400) {
          e.setState({
          results: [],
          searchStarted: true,
          shouldUpdate: true,
        })
				return []
      } else {
				return r.json()
			}
    })
    .then(data => {
        e.setState({
          results: data,
          searchStarted: true,
          searchItems: searchTerms,
		      route: `search?skills=${searchTerms}`,
          shouldUpdate: true,
        })
    })
    .catch(error => {
        console.error(`requestSearch:${error}`)
    })

    if (searchTerms.length == 0) {
      e.setState({
        route: "search"
      })
    }
  }
}

  handleDropdownSelect(val) {
    if (val != "all") {
      this.setState({
        locationTerm: `location=${val}&`,
        dropdownLabel: val
      })
    } else {
      this.setState({
        locationTerm: "",
        dropdownLabel: "Alle Standorte"
      })
    }

    if (this.state.searchStarted) {
      this.requestSearch(this, this.state.searchItems)
    }
  }

  componentDidUpdate(prevProps, prevState) {
		const {searchItems, route, results} = this.state
    document.SearchBar.SearchInput.focus()
    if ((this.props.params.searchTerms != searchItems) && results.length > 0) {
      browserHistory.replace(route)
    }

  }

  // update component only if search has changed
  shouldComponentUpdate(nextProps, nextState) {
		const {searchItems} = this.state
		const haveSearchItemsChanged = searchItems.length != nextState.searchItems.length
    if (nextState.shouldUpdate && haveSearchItemsChanged){
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
		if (searchStarted){
			return(
				<Results
					results={results}
					searchTerms={searchItems}
					noResultsLabel={"Keine Ergebnisse"}>
					<User searchTerms={searchItems}/>
				</Results>
			)
		} else {
			return(
				<div class="info-text">
					Du bist auf der Suche nach speziellen Talenten oder Personen mit bestimmten Skills bei SinnerSchrader?
					Dann gib Deinen Suchbegriff ein und Du bekommst eine Liste mit potentiellen Kandidaten angezeigt.
				</div>
			)
		}
	}

  render() {
		console.log(this.props.location.query.skills)
		const {results, dropdownLabel, searchItems, searchStarted} = this.state
    return(
      <div class="searchbar">
        <Dropdown
					onDropdownSelect={this.handleDropdownSelect}
					dropdownLabel={dropdownLabel}/>
        <SearchBar
					handleRequest={this.requestSearch}
					toggleUpdate={this.toggleUpdate}
					parent={this}
					searchTerms={searchItems}
					noResults={results.length === 0}>
          <SearchSuggestions
						searchTerms={searchItems}
						noResults={results.length === 0}/>
        </SearchBar>
        {this.renderResults(searchStarted, results, searchItems)}
        {this.props.children}
      </div>
    )
  }
}
