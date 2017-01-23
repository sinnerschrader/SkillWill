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
      searchRequest: "",
      locationTerm: ""
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
      console.log("s" + data);
        e.setState({results: data});
    })
    .catch(function(error) {
        console.error("requestSearch" + error);
        e.setState({results: null});
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if(this.state.currentValue.length != 0) {
      this.setState({
        searchTerms: this.state.searchTerms.concat([this.state.currentValue]),
        currentValue : ""
      });
    } 
    this.requestSearch(this);
  }

  handleChange(e) {
    console.log("current: " + this.state.results);
    this.setState({
      currentValue : e.target.value
    });     
  }

  handleClose(j) {
    let helperArray= [];
    this.state.searchTerms.map((searchTerm, i) => {
      if(i == j) {
        i++
      }
      else {
        helperArray[i] = searchTerm;
      }
    });
    this.setState({
      searchTerms: helperArray
    });

    /*update searchTerms, if there is an unsubmitted searchinput */
    if(this.state.currentValue.length != 0) {
      this.setState({
        searchTerms: helperArray.concat([this.state.currentValue]),
        currentValue : ""
      });
    }

    /*refresh search */
    this.requestSearch(this);
  }

  handleDropdownSelect(e) {
    if(e.target.value != "all") {
      this.setState({
        locationTerm: "location=" + e.target.value +"&"
      }); 
    } 
    else { 
      this.setState({
        locationTerm: ""
      }); 
    }
  }


  render() {
    return(
      <div class="searchbar" id="searchbar">
        <form onSubmit={this.handleSubmit}>
          <div class="dropdown">
            <select onChange={this.handleDropdownSelect}>
            <option value="all">Alle Standorte</option>
            <option value="Hamburg">Hamburg</option>
            <option value="Frankfurt">Frankfurt</option>
            <option value="München">München</option>
            </select>
          </div>
          <div class="inputContainer">
              {
                 /* display entered searchTerms in front of the input field*/
                this.state.searchTerms.map((searchTerm, i) => {
                  return(
                    <div class="searchTerm" >
                      {searchTerm}
                      <a class="close" href="#" key={i} onClick={this.handleClose.bind(null, i)}>&#9747;</a>
                    </div>
                    );
                })
              }
          <input type="search" value={this.state.currentValue} autofocus="true" onChange={this.handleChange} ></input>
          </div>
          <button type="submit" class="search" />
        </form>
        {/* Result Component to display all results in state.results */}
        <Results results={this.state.results} searchTerms={this.state.searchTerms} />
      </div>
    )
  }
}
