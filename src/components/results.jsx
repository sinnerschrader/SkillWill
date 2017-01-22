import React from 'react';
import ResultItem from './result-item.jsx';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultArray: []
    }
    console.log("results" + this.props.results);
  }


  render() {
    if (this.props.results != null ) {
      return(
        <div>
          <div>
            <span>{this.props.results.length} Ergebnisse</span>
          </div>
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
        <div> 
            <div>
              <span>Keine Ergebnisse</span>
            </div>
        </div>
      ) 
    }
  }
}
