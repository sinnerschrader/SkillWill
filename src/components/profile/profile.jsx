import React from 'react';
import User from "../user/user.jsx";
import ProfileInformation from "./profile-information.jsx";
import SkillSearch from "../search/skill-search.jsx";
import config from '../../config.json';
import sortAlphabetically from '../../libs/sortAlphabetically.jsx'
import Login from '../login/login.jsx'


export default class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: "id",
        session: undefined,
        data: null,
        dataLoaded: false,
        searchLayerOpen: false,
        loginLayerOpen: false,
      }

      this.removeSkill = this.removeSkill.bind(this);
      this.editOrAddSkill = this.editOrAddSkill.bind(this);
      this.openSkillSearch = this.openSkillSearch.bind(this);
      this.openProfileInformation = this.openProfileInformation.bind(this);
      this.checkLogin = this.checkLogin.bind(this);
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

    editOrAddSkill(user, skill, skillLvl, willLvl) {

    }

    openSkillSearch(){
        this.checkLogin();
        this.setState({
            searchLayerOpen: true
        });
    }

    openProfileInformation(){
        this.setState({
            searchLayerOpen: false
        });
    }

    checkLogin() {
      this.setState({ loginLayerOpen: !this.state.session })
    }

    closeLogin() {
        this.setState({ loginLayerOpen: false })
    }

    renderProfile() {
      return(
            <div class="profile">
            {this.state.searchLayerOpen ?
                <div>
                    <SkillSearch handleEdit={this.editOrAddSkill} checkLogin={this.checkLogin}/>
                    <a class="back-btn" onClick={this.openProfileInformation}>X</a>
                </div>
            :
                <div>
                    {this.state.dataLoaded ?
                        <ProfileInformation data={this.state.data} thisElem={this} handleRemove={this.removeSkill} handleEdit={this.editOrAddSkill} checkLogin={this.checkLogin}/>
                        : ""
                    }
                    <a class="add-skill-btn" onClick={this.openSkillSearch}>+</a>
                </div>
            }
        </div>
      )
    }

    renderLoginLayer() {
      return (
          <Login />
      )
    }


    render() {
        return(
            <div class="profile-container">
                <a href="../../" class="close-btn">X</a>
                {this.state.loginLayerOpen ? this.renderLoginLayer() : this.renderProfile() }
            </div>
        )
    }
}
