import React from 'react';
import styles from './header.less';
import Results from './results.jsx';

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      results: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestSearch = this.requestSearch.bind(this);

  }

  requestSearch(e) {
    fetch("http://localhost:1337/users?search=Java")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      console.log("s" + data);
        e.setState({results: data});
    })
    .catch(function(e) {
        console.error("getData" + e);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("change" + e);
    this.requestSearch(this);

  }

  render() {
    return(
      <div>
        <h1>SkillWill</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="search" />
          <button type="submit"> Go </button>
        </form>
        <Results results={this.state.results} />
      </div>
    )
  }
}
