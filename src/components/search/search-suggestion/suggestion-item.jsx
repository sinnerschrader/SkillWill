import React from 'react' 

export default class SuggestionItem extends React.Component {

  constructor(props) {
    super(props) 
  }

  render() {
    return(
      <a class="search-suggestions-item" onclick={() => this.props.handleSuggestionSelected(this.props.name)}>{this.props.name}</a>
    )
  }
}
