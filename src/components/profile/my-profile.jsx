import React from 'react' 
import { Router, Link, browserHistory } from 'react-router' 
import BasicProfile from "./basic-profile.jsx" 
import SkillSearch from "../search/skill-search.jsx" 
import config from '../../config.json' 
import Editor from '../editor/editor.jsx' 
import Cookies from 'react-cookie' 

export default class MyProfile extends React.Component {
    constructor(props) {
      super(props) 
      this.state = {
        session: undefined,
        userId: "id",
        data: null,
        dataLoaded: false,
        editLayerOpen: false,
        openLayerAt: -1,
        showAllSkills: false,
        skillSearchOpen: false,

      }
        this.infoLayer = this.infoLayer.bind(this) 
        this.openCloseEditLayer = this.openCloseEditLayer.bind(this) 
        this.checkAndOpenLogin = this.checkAndOpenLogin.bind(this) 
        this.openCloseSkillSearch = this.openCloseSkillSearch.bind(this) 
        this.editSkill = this.editSkill.bind(this)
        this.deleteSkill = this.deleteSkill.bind(this) 
        this.getProfileData = this.getProfileData.bind(this) 

        if (!this.checkAndOpenLogin()) {
            browserHistory.push("/my-profile/login") 
        }
    }

    componentDidMount() {
        const elem = this 
        elem.setState({
            userId: elem.props.params.id
        }) 
        elem.getProfileData(elem) 
        if (! this.checkUser()) {
            browserHistory.push("/my-profile/login") 
        }
    }
       
    getProfileData(elem) {
        fetch(config.backendServer + "/users/"+ elem.state.userId)
            .then(r => r.json())
            .then(function(data) {
                elem.setState({
                    data: data,
                    dataLoaded: true
                }) 
            })
            .catch(function(error) {
                console.error(error) 
            }) 
    }

    checkAndOpenLogin() {
      let s =  this.state.session || Cookies.load("session")
      if (s != this.state.session || !s) {
        this.setState({session: s})
      }
      return !!s 
    }

    checkUser() {
        // check if the profiles userID matches with the logged in user
        let u =  Cookies.load("user")
        if (u != this.state.userId) {
            return false 
        }
        return true 
    }

    infoLayer(data, i, showAllSkills) {
       if (this.state.editLayerOpen && (this.state.openLayerAt == i)) {
           return (
                <Editor skillName={data.name} skillLvl={data.skillLevel} willLvl={data.willLevel} handleAccept={this.editSkill} handleClose={this.openCloseEditLayer.bind(null)} />
           )
       }
       else {
           return(
                <div class="additional-options">
                    <div class="edit" onClick={this.openCloseEditLayer.bind(null,i, showAllSkills )}></div>
                    <div class="delete" onClick={this.deleteSkill.bind(null, data.name)}></div>
                </div>
           )
       }
    }   

    openCloseEditLayer(i, show) {
        this.setState({
            openLayerAt: i,
            editLayerOpen: !this.state.editLayerOpen,
            showAllSkills: show
      }) 
    }

    openCloseSkillSearch() {
        this.setState({skillSearchOpen: !this.state.skillSearchOpen}) 
    }

    editSkill(skill, skillLvl, willLvl) {
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
          this.editSkill(skill, skillLvl, willLvl) 
          this.setState({editLayerOpen: false}) 
          this.getProfileData(this)
        }

        if (res.status != 200) {
          throw Error("error while editing skills")
        }
        else {
            this.getProfileData(this) 
        }

      })
      .catch(err => console.log(err))
    }

    deleteSkill(skill) {

      fetch(config.backendServer + "/users/" + this.state.userId + "/skills?session=" + this.state.session + "&skill=" + skill, {method: "DELETE"})
      .then(res => {
        if (res.status == 401) {
          this.setState({session: undefined})
          Cookies.remove("session") 
          this.deleteSkill(skill) 
          this.setState({editLayerOpen: false}) 
          this.getProfileData(this) 
        }

        if (res.status != 200) {
          throw Error("error while deleting skills")
        }
        else {
            this.getProfileData(this) 
        }

      })
      .catch(err => console.log(err))
    }

    render() {
        return (
            this.state.dataLoaded ?
                this.state.skillSearchOpen ?
                 <div class="profile">
                    <SkillSearch handleEdit={this.editSkill} data={this.state.data}/>
                    <div class="back-btn" onClick={this.openCloseSkillSearch}></div>
                </div>
                :
                <div class="profile">
                    <BasicProfile data={this.state.data} thisElem={this} infoLayer={this.infoLayer} openLayerAt={this.state.openLayerAt} showAllSkills={this.state.showAllSkills} checkLogin={this.checkAndOpenLogin}/>
                    <div class="add-skill-btn" onClick={this.openCloseSkillSearch}></div>
                </div>
                : ""
        )
    }
}
