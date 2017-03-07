import React from 'react';
import User from "../user/user.jsx";
import ProfileInformation from "./profile-information.jsx";
import SkillSearch from "../search/skill-search.jsx";
import config from '../../config.json';

export default class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: "id",
        dataLoaded: false,
        data: null,
        searchLayerOpen: false
      }
      this.removeSkill = this.removeSkill.bind(this);
      this.sortAlphabetically = this.sortAlphabetically.bind(this);
      this.openSkillSearch = this.openSkillSearch.bind(this);
      this.openProfileInformation = this.openProfileInformation.bind(this);
    }
    componentDidMount() {
      const elem = this;
        elem.setState({
          userId: elem.props.params.id
      });

      fetch(config.backendServer + "/users/"+ elem.state.userId)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            elem.setState({
              data: data,
              dataLoaded: true
            });
            let currData = elem.data;
            elem.sortAlphabetically(currData.skills);
            elem.setState({
              data: currData
            });
        })
        .catch(function(error) {
            console.error(error);
        });
    }

     sortAlphabetically(items) {
       items.sort(a, b => {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
     }

    removeSkill(skill) {
      fetch(config.backendServer + "/users/"+ this.state.userId + "?" + this.state.session +"&skill=" + skill)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
        })
        .catch(function(error) {
            console.error(error);
        });
    }

    openSkillSearch(){
        this.setState({
            searchLayerOpen: true
        });
    }

    openProfileInformation(){
        this.setState({
            searchLayerOpen: false
        });
    }

render() {
    return(
        <div class="profile-container">
            <a href="../../" class="close-btn">X</a>
            {this.state.searchLayerOpen ?
                <div class="profile">
                    <SkillSearch />
                    <a class="back-btn" onClick={this.openProfileInformation}>X</a>
                </div>
               :
                <div class="profile">
                    {this.state.dataLoaded ?
                        <ProfileInformation data={this.state.data} handleRemove={this.removeSkill}/>
                        : "" 
                    }
                    <a class="add-skill-btn" onClick={this.openSkillSearch}>+</a>
                </div>
            } 
        </div>
    )
  }
}
