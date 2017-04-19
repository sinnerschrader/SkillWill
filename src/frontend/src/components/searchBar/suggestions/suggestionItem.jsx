import React from 'react';

export default class SearchSuggestions extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <li class="search-suggestions-item" onclick={() => this.props.handleSuggestionSelected(this.props.name)}>{this.props.name}</li>
    )
  }
}
