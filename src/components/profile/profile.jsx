import React from 'react';
import User from "../user/user.jsx";
import ProfileInformation from "./profile-information.jsx";
import SkillSearch from "../search/skill-search.jsx";
import config from '../../config.json';
import sortAlphabetically from '../../libs/sortAlphabetically.jsx'

export default class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: "id",
        session: "X",
        data: null,
        dataLoaded: false,
        searchLayerOpen: false
      }

      this.removeSkill = this.removeSkill.bind(this);
      this.editOrAddSkill = this.editOrAddSkill.bind(this);
      this.openSkillSearch = this.openSkillSearch.bind(this);
      this.openProfileInformation = this.openProfileInformation.bind(this);
    }
    componentDidMount() {
      const elem = this;
        elem.setState({
          userId: elem.props.params.id
      });

      fetch(config.backendServer + "/users/"+ elem.state.userId)
        .then(r => r.json())
        .then(function(data) {
            elem.setState({
              data: data,
              dataLoaded: true
            });

            let currData = eval(elem.state.data);
            sortAlphabetically(currData.skills);
            elem.setState({
              data: currData
            });
        })
        .catch(function(error) {
            console.error(error);
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
    
    editOrAddSkill(elem, skill, skillLvl, willLvl) {
      fetch(config.backendServer + "/users/"+ elem.state.userId + "?" + elem.state.session + "&skill=" + skill + "&skill_level" + skillLvl + "&will_level" + willLvl)
        .then(function(response) {
            console.log(" " +config.backendServer + "/users/"+ elem.state.userId + "?" + elem.state.session + "&skill=" + skill + "&skill_level" + skillLvl + "&will_level" + willLvl);
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
                    <div class="profile">
                    {this.state.searchLayerOpen ?
                        <div>
                            <SkillSearch />
                            <a class="back-btn" onClick={this.openProfileInformation}>X</a>
                        </div>
                    :
                        <div>
                            {this.state.dataLoaded ?
                                <ProfileInformation data={this.state.data} thisElem={this} handleRemove={this.removeSkill} handleEdit={this.editOrAddSkill}/>
                                : "" 
                            }
                            <a class="add-skill-btn" onClick={this.openSkillSearch}>+</a>
                        </div>
                    } 
                </div>
            </div>
        )
    }
}
