import React from 'react';
import SearchBar from './search-bar.jsx';
import Results from './results/results.jsx';
import Dropdown from '../dropdown/dropdown.jsx';
import User from '../user/user.jsx';
import config from '../../config.json';

export default class UserSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      locationTerm: "",
      dropdownLabel: "Alle Standorte",
      searchItems: [],
      searchStarted: false,
      shouldUpdate: false
    }
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
  }

  requestSearch(e, searchTerms) {
    fetch(config.backendServer + "/users?"+ e.state.locationTerm + "skills="+ searchTerms)
    .then(r => {
      console.log(config.backendServer +"/users?"+ e.state.locationTerm + "skills="+ searchTerms); 
      return r.json();
    })
    .then(data => {
        e.setState({
          results: data,
          searchStarted: true,
          searchItems: searchTerms,
          shouldUpdate: true
        });
    })
    .catch(error => {
        console.error("requestSearch" + error);
        e.setState({results: null});
    });
  }

  handleDropdownSelect(val) {
    if (val != "all") {
      this.setState({
        locationTerm: "location=" + val +"&",
        dropdownLabel: val
      }); 
    } 

    else { 
      this.setState({
        locationTerm: "",
        dropdownLabel: "Alle Standorte"
      }); 
    }

    if (this.state.searchStarted) {
      this.requestSearch(this, this.state.searchItems);
    }
  }

  componentDidUpdate() {
    document.SearchBar.SearchInput.focus();
  }

  // update component only if search has changed
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate && ((this.state.results !== nextState.results) || (this.state.searchItems.length !== nextState.searchItems.length) ) ) {
      return true;
    }
    return false;
  }

  toggleUpdate(bool) {
    this.setState({
      shouldUpdate: bool
    }); 
  }

  render() {
    return(
      <div class="searchbar">
        <Dropdown onDropdownSelect={this.handleDropdownSelect} dropdownLabel={this.state.dropdownLabel}/>
        <SearchBar handleRequest={this.requestSearch} toggleUpdate={this.toggleUpdate} parent={this} searchTerms={this.state.searchItems}/>
        {/* display Results component only when there has been an inital search */}
        {
          this.state.searchStarted ? 
            <Results results={this.state.results} searchTerms={this.state.searchItems} > 
              <User searchTerms={this.state.searchItems}/>
            </Results> 
          : <div class="info-text">
                Du bist auf der Suche nach speziellen Talenten oder Personen mit bestimmten Skills bei SinnerSchrader?
                Dann gib Deinen Suchbegriff ein und Du bekommst eine Liste mit potentiellen Kandidaten angezeigt. 
            </div>
        }  
         {this.props.children}
      </div>
    )
  }
}
