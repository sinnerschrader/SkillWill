import React from 'react';
import ResultItem from './result-item.jsx';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultArray: []
    }
    this.renderUserSkills = this.renderUserSkills.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.results !== nextProps.results) {
      return true;
    }
    return false;
  }

  renderUserSkills() {

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
