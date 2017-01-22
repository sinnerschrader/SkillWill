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
            <li>
                Name: {this.props.data.firstName} {this.props.data.lastName}<br/>
                ID: {this.props.data.id}<br/>
                {this.props.data.title}<br/>
            </li>
            <li>{this.props.data.location}</li>
            <li class="skillList">
                <ul>
                {this.state.searchedSkills.map((data, i) => { 
                    return(
                        <li key={i}>
                            <ul>
                                <li>
                                    {data.name}<br/>
                                    skillLevel: {data.skillLevel}<br/>
                                    willLevel: {data.willLevel }
                                </li>
                            </ul>
                        </li>
                    );
                })}
                </ul>
                 
            </li>                
        </ul>
    )
  }
}
