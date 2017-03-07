import React from 'react';
import User from '../../../user/user.jsx';
import Skill from '../../../skill/skill.jsx';

export default class ResultItem extends React.Component {
   constructor(props) {
    super(props);
  }

  render() {
    if (this.props.resultType == "user") {
        return(
            <div>
                {/*<div class="user-img"></div> ToDo: add as component */} 
                <User data={this.props.data} searchTerms={this.props.searchTerms}/> 
            </div>
        )
    }
    else {
        return(
            <div>
                {/*<div class="user-img"></div> ToDo: add as component */} 
                <Skill data={this.props.data}/> 
            </div>
        )
    }
  }
}
