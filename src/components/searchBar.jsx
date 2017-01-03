import React from 'react';
import styles from './header.less';
import Results from './results.jsx';

export default class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      results: [],
      currentValue: "",
      searchterms: [] 
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestSearch = this.requestSearch.bind(this);

  }

  requestSearch(e) {
    fetch("http://localhost:1337/users?search="+ e.state.currentValue)
    .then(function(response) {
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
    this.setState({
      searchterms: this.state.currentValue
    });
    console.log("searchterms :" +this.state.searchterms);
    this.requestSearch(this);
  }

  handleChange(e) {
    this.setState({
      currentValue : e.target.value,
    });
    
  }

  render() {
    return(
      <div className="searchbar" id="header">
        <form onSubmit={this.handleSubmit}>
          <div className="dropdown"> Alle Standorte
            <ul>
              <li><a href="">Hamburg</a></li>
              <li><a href="">Frankfurt</a></li>
              <li><a href="">München</a></li>
            </ul>
          </div>
          <div className="inputContainer">
              <div class="searchterm">{this.state.searchterms}</div>
              <input type="search"  onChange={this.handleChange} />
          </div>
          <button type="submit"> Go </button>
        </form>
        {/* Result Component to display all results in state.results */}
        <Results results={this.state.results} />
      </div>
    )
  }
}
