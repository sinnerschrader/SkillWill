import React from 'react';

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
            //covert the skill- and willlevel into visual component
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
        <ul>
            {/*<div class="user-img"></div> ToDo: add as component */} 
            <li class="info">
                <a>{this.props.data.firstName} {this.props.data.lastName}</a><br/>
                <span>{this.props.data.id}</span><br/>
                <span class="department">{this.props.data.title}</span><br/>
            </li>
            <li class="location">{this.props.data.location}</li>
            <li class="skills">
                <ul>
                {this.state.searchedSkills.map((data, i) => { 
                    return(
                        <li key={i}>
                            <p class="skill-name">{data.name}</p><br/>
                            <p>skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                        </li>
                    );
                })}
                </ul>
                 
            </li>                
        </ul>
    )
  }
}
