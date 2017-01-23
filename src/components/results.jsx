import React from 'react';
import ResultItem from './result-item.jsx';

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
      
    }else {
       return(
        <div class="results-container"> 
            <a class="counter">
                Keine Ergebnisse
            </a>
        </div>
      ) 
    }
  }
}
