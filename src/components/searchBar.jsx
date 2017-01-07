import React from 'react';
import styles from './header.less';
import Results from './results.jsx';
import Dropdown from './dropdown.jsx';

export default class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      results: [],
      currentValue: "",
      searchTerm: [],
      searchRequest: "",
      locationTerm: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);

  }

  requestSearch(e) {
    fetch("http://localhost:1337/users?"+ e.state.locationTerm + "skills="+ e.state.searchTerm)
    .then(function(response) {
      console.log("http://localhost:1337/users?skills="+ e.state.searchTerm);
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
        searchTerm: this.state.searchTerm.concat([this.state.currentValue]),
        currentValue : ""
      });
    } 
    this.requestSearch(this);
  }

  handleChange(e) {
    this.setState({
      currentValue : e.target.value,
    });
    
  }

  handleClose(j) {
    let helperArray= [];
    this.state.searchTerm.map((searchterm, i) => {
      if(i == j) {
        i++
      }
      else {
        helperArray[i] = searchterm;
      }
    });
    this.setState({
      searchTerm: helperArray
    });

    /*update searchterm, if there is an unsubmitted searchinput */
    if(this.state.currentValue.length != 0) {
      this.setState({
        searchTerm: helperArray.concat([this.state.currentValue]),
        currentValue : ""
      });
    }

    /*refresh search */
    this.requestSearch(this);
  }
  handleDropdownChange(location) {
    if(location != ""){
      this.setState({
        locationTerm: "?location=" + location + "?"
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
      <div class="searchbar" id="header">
        <form onSubmit={this.handleSubmit}>
          <Dropdown onChange={this.handleDropdownChange} />
          <div class="inputContainer">
              {
                 /* display entered searchTerm in front of the input field*/
                this.state.searchTerm.map((searchterm, i) => {
                  return(
                    <div class="searchterm" >
                      {searchterm}
                      <a class="close" href="#" key={i} onClick={this.handleClose.bind(null, i)}>X</a>
                    </div>
                    );
                })
              }
          <input type="search" value={this.state.currentValue} onChange={this.handleChange} />
          </div>
          <button type="submit"> Go </button>
        </form>
        {/* Result Component to display all results in state.results */}
        <Results results={this.state.results} />
      </div>
    )
  }
}
