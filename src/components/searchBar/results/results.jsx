import React from 'react';
import ResultItem from './result-item/result-item.jsx';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultArray: []
    }
    this.scrollToResults = this.scrollToResults.bind(this);
  }

  scrollToResults(e) {
    e.preventDefault();
    const scrollTo = document.getElementById("searchbar");
    scrollTo.scrollIntoView();
  }

  render() {
    if (this.props.results != null ) {
      if (this.props.results.length != 0) {
      return(
        <div class="results-container">
          <a href="" class="counter" onClick={this.scrollToResults}>
            <span>{this.props.results.length} Ergebnisse</span>
          </a>
          <ul class="results">
            {this.props.results.map((data, i) => {
              return(
                  <li class="result-item" key={i}> 
                    <ResultItem data={data} index={i} searchTerms={this.props.searchTerms}/>
                  </li>
              );
            })}
          </ul>
        </div>
      )
      } 
      else {
       return(
        <div class="results-container empty"> 
            <a class="counter">Keine Ergebnisse</a>
        </div>
      ) 
    }
    } 
    else {
       return(
        <div class="results-container empty"> 
            <a class="counter">Keine Ergebnisse</a>
        </div>
      ) 
    }
  }
}
