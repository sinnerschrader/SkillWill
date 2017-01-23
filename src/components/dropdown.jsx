import React from 'react';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  propTypes = {  
    onSelect: React.PropTypes.func
  }

  handleDropdownChange(e) {
    const val= e.target.value;
    if(val != "" ){
      /* calls onChange method, defined as a prop in the parent component.
      This prop is necessary to give the parent access to the selected value */
      this.props.onSelect(val);
      console.log(val);
    } 
  }

  render() {
    return(
        <div class="dropdown">
          <select onChange={this.handleDropdownChange}>
          <option value="all">Alle Standorte</option>
          <option value="Hamburg">Hamburg</option>
          <option value="Frankfurt">Frankfurt</option>
          <option value="München">München</option>
          </select>
        </div>

    )
  }
}
