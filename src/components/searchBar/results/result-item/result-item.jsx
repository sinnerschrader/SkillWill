import React from 'react';
import User from '../../../user/user.jsx';

export default class ResultItem extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      allSkills: this.props.data.skills,
      searchedSkills: [],
    }
    this.state.allSkills.map((data,i) => { 
        let isASearchedSkill = this.props.searchTerms.indexOf(data.name);
        if (isASearchedSkill > -1) {
            const skillLevel = data.skillLevel;
            //convert the skill- and willlevel into a visual component
            if (skillLevel == 0) {
                data.skillLevel = "-";
            }
            else {
                data.skillLevel = "";
                for (var counter = 0; counter < skillLevel; counter++) {
                    data.skillLevel= data.skillLevel + "◼";
                }
            }
            const willLevel = data.willLevel;
            if (willLevel == 0) {
                data.willLevel = "-";
            }
            else {
                data.willLevel = "";
                for (var counter = 0; counter < willLevel; counter++) {
                    data.willLevel= data.willLevel + "◼";
                }
            }
            this.setState({
                searchedSkills: this.state.searchedSkills.concat([data])
            }); 
        }
    });
  }

  render() {
    return(
        <div>
            {/*<div class="user-img"></div> ToDo: add as component */} 
             <User data={this.props.data} searchedSkills={this.state.searchedSkills} isProfile={false}/> 
        </div>
    )
  }
}
