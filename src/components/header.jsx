import React from 'react';
import styles from './header.less';
import Results from './results.jsx';

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      results: [],
      currentValue: {}
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
    console.log("http://localhost:1337/users?search="+ this.state.currentValue);
    this.requestSearch(this);
  }

  handleChange(e) {
    this.setState({
      currentValue : e.target.value
    });
  }

  render() {
    return(
      <div id="searchbar">
        <h1>SkillWill</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="search" onChange={this.handleChange} />
          <button type="submit"> Go </button>
        </form>
        <Results results={this.state.results} />
      </div>
    )
  }
}
