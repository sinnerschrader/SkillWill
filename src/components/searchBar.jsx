import React from 'react';
import Results from './results.jsx';
import Dropdown from './dropdown.jsx';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      currentValue: '',
      searchTerms: [],
      locationTerm: "",
      searchStarted: false,
      shouldUpdate: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);

  }

  requestSearch(e) {
    fetch("http://localhost:1337/users?"+ e.state.locationTerm + "skills="+ e.state.searchTerms)
    .then(function(response) {
        console.log("http://localhost:1337/users?"+ e.state.locationTerm + "skills="+ e.state.searchTerms);
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

    /* update searchTerms, if there is an unsubmitted searchinput */
    if (this.state.currentValue.length != 0) {
      this.setState({
        searchTerms: helperArray.concat([this.state.currentValue]),
        currentValue : ""
      });
    } 

    /* refresh search */
    this.requestSearch(this);
  }

  handleDropdownSelect(val) {
    if (val != "all") {
      this.setState({
        locationTerm: "location=" + val +"&"
      }); 
    } 
    else { 
      this.setState({
        locationTerm: ""
      }); 
    }
    if (this.state.searchStarted) {
      this.requestSearch(this);
    }
  }

  /* update component only if search has changed */
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate && ((this.state.results !== nextState.results) || (this.state.searchTerms.length !== nextState.searchTerms.length) ) ) {
      return true;
    }
    return false;
  }


  render() {
    return(
      <div class="searchbar" id="searchbar">
        <form onSubmit={this.handleSubmit}>
          <Dropdown onSelect={this.handleDropdownSelect} />
          <div class="inputContainer">
              {
                 /* display entered searchTerms in front of the input field */
                this.state.searchTerms.map((searchTerm, i) => {
                  return(
                    <div class="searchTerm" >
                      {searchTerm}
                      <a class="close" key={i} onClick={this.handleClose.bind(null, i)}>&#9747;</a>
                    </div>
                    );
                })
              }
            <input type="search" value={this.state.currentValue} autofocus="true" onChange={this.handleChange} ></input>
          </div>
          <button type="submit" class="search" />
        </form>
        {/* display Results component only when there has been an inital search */}
        {
          this.state.searchStarted ? 
            <Results results={this.state.results} searchTerms={this.state.searchTerms} /> 
          : <div class="info-text">
                Du bist auf der Suche nach speziellen Talenten oder Personen mit bestimmten Skills bei SinnerSchrader?<br/>
                Dann gib Deinen Suchbegriff ein und Du bekommst eine Liste mit potentiellen Kandidaten angezeigt. 
            </div>
        }  
      </div>
    )
  }
}
