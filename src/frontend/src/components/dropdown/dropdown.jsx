import React from 'react'

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.state = {
      dropdownLabel: this.props.dropdownLabel
    }
  }

  handleDropdownChange(e) {
    const val= e.target.value
    if (this.props.dropdownLabel != val) {
      this.setState({
        dropdownLabel: val
      })
      /* calls onChange method, defined as a prop in the parent component.
      This prop is necessary to give the parent access to the selected value */
      this.props.onDropdownSelect(val)
    }
  }

  render() {
    return(
        <div class="dropdown">
          <span class="dropdown-label">{this.props.dropdownLabel}</span>
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
