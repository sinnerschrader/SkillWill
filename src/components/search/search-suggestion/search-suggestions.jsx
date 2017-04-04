import React from 'react'
import config from '../../../config.json'
import SuggestionItem from './suggestion-item.jsx'

export default class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      doAutoComplete: this.props.currentValue.length >= 3
    }
    this.requestItems = this.requestItems.bind(this)
    this.getHint = this.getHint.bind(this)
  }

  componentDidMount() {
    this.requestItems()
  }

  requestItems(e) {
    let searchTerms
    if (this.props.noResults) {
      searchTerms = []
    } else {
      searchTerms = this.props.searchTerms
    }
    let suggestionUrl = config.backendServer + '/skills/next?count=5&search=' + searchTerms.join(',')
    let autocompleteUrl = config.backendServer + '/skills?count=5&search=' + this.props.currentValue
    fetch(this.state.doAutoComplete ? autocompleteUrl : suggestionUrl)
    .then(res => res.status == 200 ? res.json() : [])
    .then(data => this.setState({ results : data }))
    .catch(err => console.log(err))
  }

  getHint() {
    if (this.state.doAutoComplete) {
      return "Meinst du vielleicht:"
    }
    if (!this.props.noResults && this.props.searchTerms.length > 0) {
      return "Zu deiner Suche passende Skills:"
    }
    return "Oft gesuchte Skills:"
  }

  render() {
    return(
      <div class={this.state.results.length > 0 ? 'search-suggestions' : 'search-suggestions hidden'}>
        <p class="info">{this.getHint()}</p>
        <ul class="search-suggestions-list">
          {this.state.results.length > 0
            ? this.state.results.map(s => {
							<SuggestionItem name={s.name} handleSuggestionSelected={this.props.handleSuggestionSelected} />
						})
            : <SuggestionItem name='none' /> }
          </ul>
      </div>
    )
  }
}



