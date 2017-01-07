import React from 'react';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val= ""
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({
      val = e.target.value
    });
    this.props.onChange(val);
  }

  render() {
    return(
    <div class="dropdown">
        <select class="dropdown-select" onChange={this.handleChange}>
        <option value="">Alle Standorte</option>
        <option value="hamburg">Hamburg</option>
        <option value="frankfurt">Frankfurt</option>
        <option value="muenchen">München</option>
        </select>
    </div>

    )
  }
}
