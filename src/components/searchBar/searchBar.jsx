import React from 'react';
import Results from './results/results.jsx';
import Dropdown from '../dropdown/dropdown.jsx';
import config from '(../../config.json';

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      currentValue: '',
      searchTerms: [],
      locationTerm: "",
      dropdownLabel: "Alle Standorte",
      searchStarted: false,
      shouldUpdate: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
  }

  requestSearch(e) {
    fetch(config.backendServer + "/users?"+ e.state.locationTerm + "skills="+ e.state.searchTerms)
    .then(function(response) {
        console.log(config.backendServer +"/users?"+ e.state.locationTerm + "skills="+ e.state.searchTerms);
        return response.json();
    })
    .then(function(data) {
        e.setState({
          results: data,
          searchStarted: true,
          shouldUpdate: true
        });
    })
    .catch(function(error) {
        console.error("requestSearch" + error);
        e.setState({results: null});
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.currentValue.length != 0) {
      this.setState({
        searchTerms: this.state.searchTerms.concat([this.state.currentValue]),
        currentValue : ""
      });
    } 
    this.requestSearch(this);
  }

  handleChange(e) {
    this.setState({
      currentValue : e.target.value
    });     
  }

  handleKeyDown(e) {
    //remove recently added searchTerm on Backspace
    if (this.state.currentValue == "" && e.keyCode == 8 && this.state.searchTerms != "") {
      this.setState ({
      searchTerms: this.state.searchTerms.slice(0,(this.state.searchTerms.length-1))  
      });
      this.requestSearch(this);
    }
  }

  handleClose(j) {
    let helperArray= [];
    let helperIndex = 0;
    this.state.searchTerms.map((searchTerm, i) => {
      //skip deleted term
      if (i != j) {
        helperArray[helperIndex] = searchTerm;
        helperIndex++;
      }
    });
    this.setState({
      shouldUpdate: false,
      searchTerms: helperArray
    });

    // update searchTerms, if there is an unsubmitted searchinput 
    if (this.state.currentValue.length != 0) {
      this.setState({
        searchTerms: helperArray.concat([this.state.currentValue]),
        currentValue : ""
      });
    } 

    // refresh search
    this.requestSearch(this);
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
      this.requestSearch(this);
    }
  }

  // update component only if search has changed
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate && ((this.state.results !== nextState.results) || (this.state.searchTerms.length !== nextState.searchTerms.length) ) ) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    document.SearchBar.SearchInput.focus();
  }

  render() {
    return(
      <div class="searchbar">
        <Dropdown onDropdownSelect={this.handleDropdownSelect} dropdownLabel={this.state.dropdownLabel}/>
        <form onSubmit={this.handleSubmit} name="SearchBar" autocomplete="off">
          <div class="search-container">
            <div class="input-container">
                {
                  // display entered searchTerms in front of the input field
                  this.state.searchTerms.map((searchTerm, i) => {
                    return(
                      <div class="search-term" >
                        {searchTerm}
                        <a class="close" key={i} onClick={this.handleClose.bind(null, i)}>&#9747;</a>
                      </div>
                    );
                  })
                }
              <input name="SearchInput"  autocomplete="off" placeholder="Nach welchem Skill suchst du?" type="search" value={this.state.currentValue} autofocus="true" onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
            </div>
            <button type="submit" class="search" />
          </div>
        </form>
        {/* display Results component only when there has been an inital search */}
        {
          this.state.searchStarted ? 
            <Results results={this.state.results} searchTerms={this.state.searchTerms} /> 
          : <div class="info-text">
                Du bist auf der Suche nach speziellen Talenten oder Personen mit bestimmten Skills bei SinnerSchrader?
                Dann gib Deinen Suchbegriff ein und Du bekommst eine Liste mit potentiellen Kandidaten angezeigt. 
            </div>
        }  
      </div>
    )
  }
}
