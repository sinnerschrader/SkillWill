import React from 'react';
import styles from './header.less';
import Results from './results.jsx';
import Dropdown from './dropdown.jsx';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      currentValue: '',
      searchTerm: [],
      searchRequest: "",
      locationTerm: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

  }
  handleSelect(v) {
    this.setState({
      searchRequest : v
    });
     
     
  }


  handleChange(e) {
    console.log("current: " + this.state.currentValue);
    this.setState({
      currentValue : e.target.value
    });
     console.log("target: " + e.target.value);
     
  }


  render() {
    return(
      <div class="searchbar" id="header">
        <Dropdown onSelect={this.handleSelect}/>
        <form onSubmit={this.handleSubmit}>

          <div class="inputContainer">
          <input type="search" value={this.state.currentValue} autofocus="true" onChange={this.handleChange} ></input>
          </div>
          <button type="submit"> Go </button>
        </form>
      </div>
    )
  }
}
