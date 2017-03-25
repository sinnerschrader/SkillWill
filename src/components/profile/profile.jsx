import React from 'react';
import User from "../user/user.jsx";
import ProfileInformation from "./profile-information.jsx";
import SkillSearch from "../search/skill-search.jsx";
import config from '../../config.json';
import sortAlphabetically from '../../libs/sortAlphabetically.jsx'
import Login from '../login/login.jsx'
import Cookies from 'react-cookie'


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
      this.checkAndOpenLogin = this.checkAndOpenLogin.bind(this);
      this.closeLogin = this.closeLogin.bind(this);
      this.retrieveSession = this.retrieveSession.bind(this);
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

    editOrAddSkill(skill, skillLvl, willLvl) {
      if (!this.checkAndOpenLogin()) {
        // must show login modal, abort everything
        return;
      }

      // checked login -> session is set
      let postData = new FormData()
      postData.append("skill", skill)
      postData.append("skill_level", skillLvl)
      postData.append("will_level", willLvl)
      postData.append("session", this.state.session)

      fetch(config.backendServer + "/users/" + this.state.userId + "/skills", {method: "POST", body: postData})
      .then(res => {
        if (res.status == 401) {
          this.setState({session: undefined})
          Cookies.remove("session")
          this.editOrAddSkill(skill, skillLvl, willLvl)
        }

        if (res.status != 200) {
          throw Error("error while editing skills")
        }

      })
      .catch(err => console.log(err))
    }

    openSkillSearch(){
        if (!this.checkAndOpenLogin()) {
          console.log("user needs to login");
          return
        }

        this.setState({
            searchLayerOpen: true
        });
    }

    openProfileInformation(){
        this.setState({
            searchLayerOpen: false
        });
    }

    checkAndOpenLogin() {
      let s =  this.state.session || Cookies.load("session")
      if (s != this.state.session || !s) {
        this.setState({session: s, loginLayerOpen: !s })
      }
      return !!s;
    }

    closeLogin() {
      this.setState({loginLayerOpen: false})
    }

    retrieveSession(session) {
      if (!session) {
        throw Error("session is unknown, or null, or some other bullshit")
      }

      Cookies.save("session", session)
      this.setState({ loginLayerOpen: false, session: session })
      this.closeLogin()
    }

    renderProfile() {
      return(
            <div class="profile">
            {this.state.searchLayerOpen ?
                <div>
                    <SkillSearch handleEdit={this.editOrAddSkill} />
                    <a class="back-btn" onClick={this.openProfileInformation}>X</a>
                </div>
            :
                <div>
                    {this.state.dataLoaded ?
                        <ProfileInformation data={this.state.data} thisElem={this} handleRemove={this.removeSkill} handleEdit={this.editOrAddSkill} checkLogin={this.checkAndOpenLogin}/>
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
          <Login onRetrieveSession={this.retrieveSession} onClose={this.closeLogin}/>
      )
    }


    render() {
        return(
            <div class="profile-container">
                {this.state.loginLayerOpen ? this.renderLoginLayer() : this.renderProfile() }
            </div>
        )
    }
}
