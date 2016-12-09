import React from 'react';
import styles from './header.less';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultArray: []
    }
  }

  render() {
    if(this.props.results != null) {
      return(
        <ul>
          {this.props.results.map((data, i) => {
            return(
                <li key={i}> 
                  <h3>{i + 1}.</h3>
                    <ul>
                        <li>ID: {data.firstName}</li>
                        <li>Name: {data.firstName} {data.lastName}</li>
                        <li>
                        {/*{data.skills.map((dataskills, i) => {
                          return(
                              <li key={i}>
                              <h4>Skills:</h4>
                                  <ul>
                                      <li>Skillame: {dataskills.name}</li>
                                      <li>skillLevel: {dataskills.skillLevel}</li>
                                      <li>willLevel: {dataskills.willLevel}</li>
                                  </ul>
                              </li>
                            );
                        })} */}
                      </li>
                    </ul>
                </li>
            );
          })}
          </ul>
      )
      
    }else {
       return(
        <div> KEINE ERGEBNISSE</div>
      ) 
    }
  }
}
