import React from 'react' 
import SearchBar from './search-bar.jsx' 
import Results from './results/results.jsx' 
import Dropdown from '../dropdown/dropdown.jsx' 
import SearchSuggestions from './search-suggestion/search-suggestions.jsx' 
import User from '../user/user.jsx' 
import config from '../../config.json' 

export default class UserSearch extends React.Component {

  constructor(props) {
    super(props) 
    this.state = {
      results: null,
      locationTerm: "",
      dropdownLabel: "Alle Standorte",
      searchItems: [],
      searchStarted: false,
      noResults: false,
      shouldUpdate: false
    }
    this.toggleUpdate = this.toggleUpdate.bind(this) 
    this.requestSearch = this.requestSearch.bind(this) 
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this) 

  }

  requestSearch(e, searchTerms) {
    fetch(config.backendServer + "/users?"+ e.state.locationTerm + "skills="+ searchTerms)
    .then(r => {
      console.log(config.backendServer +"/users?"+ e.state.locationTerm + "skills="+ searchTerms)  
      if (r.status === 400) {
          e.setState({
          results: null,
          searchStarted: true,
          shouldUpdate: true,
          noResults: true,
          searchItems: this.state.searchItems.slice(0,(this.state.searchItems.length-1))
        }) 
      }
      else {return r.json() }

    })
    .then(data => {
        e.setState({
          results: data,
          searchStarted: true,
          searchItems: searchTerms,
          noResults: false,
          shouldUpdate: true
        }) 
    })
    .catch(error => {
        console.error("requestSearch" + error) 
    }) 
  }

  handleDropdownSelect(val) {
    if (val != "all") {
      this.setState({
        locationTerm: "location=" + val +"&",
        dropdownLabel: val
      })  
    } 

    else { 
      this.setState({
        locationTerm: "",
        dropdownLabel: "Alle Standorte"
      })  
    }

    if (this.state.searchStarted) {
      this.requestSearch(this, this.state.searchItems) 
    }
  }

  componentDidUpdate() {
    document.SearchBar.SearchInput.focus() 
    console.log(this.state.searchStarted) 
  }

  // update component only if search has changed
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate && ((this.state.results !== nextState.results) || (this.state.searchItems.length !== nextState.searchItems.length)) ) {
      return true 
    }
    return false 
  }

  toggleUpdate(bool) {
    this.setState({
      shouldUpdate: bool
    })  
  }

  render() {
    return(
      <div class="searchbar">
        <Dropdown onDropdownSelect={this.handleDropdownSelect} dropdownLabel={this.state.dropdownLabel}/>
        <SearchBar handleRequest={this.requestSearch} toggleUpdate={this.toggleUpdate} parent={this} searchTerms={this.state.searchItems} noResults={this.state.noResults}>
          <SearchSuggestions searchTerms={this.state.searchItems} noResults={this.state.results == null? true : false}/>
        </SearchBar>
        {/* display Results component only when there has been an inital search */}
        {
          this.state.searchStarted ? 
              <Results results={this.state.results} searchTerms={this.state.searchItems} noResultsLabel={"Keine Ergebnisse"}> 
                <User searchTerms={this.state.searchItems}/>
              </Results> 
          : 
          <div class="info-text">
                Du bist auf der Suche nach speziellen Talenten oder Personen mit bestimmten Skills bei SinnerSchrader?
                Dann gib Deinen Suchbegriff ein und Du bekommst eine Liste mit potentiellen Kandidaten angezeigt. 
          </div>
        }
         {this.props.children}
      </div>
    )
  }
}
