import React from 'react';
import User from "../user/user.jsx";
import config from '../../config.json';
import Editor from '../editor/editor.jsx'

export default class ProfileInformation extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userAvatarPath: "",
        showAllSkills: false,
        infoLayerAt: null,
        editLayerAt: null,
        skillsToShow: 6
      }
       this.showAllSkills = this.showAllSkills.bind(this);
       this.openInfoLayer = this.openInfoLayer.bind(this);
       this.closeInfoLayer = this.closeInfoLayer.bind(this);
       this.renderSkills = this.renderSkills.bind(this);
       this.openEditLayer = this.openEditLayer.bind(this);
       this.handleEdit = this.handleEdit.bind(this);
       this.loadAvatar = this.loadAvatar.bind(this);

    }

    loadAvatar(name) {
      /*  fetch("https://wiki.sinnerschrader.com/rest/api/user?username=meimen",
            {
                method: 'GET',
                mode: 'no-cors',
                headers:{
                'Access-Control-Allow-Origin':'*'
                },
            }
        )
        .then(r => r.json())
        .then(data => {
            elem.setState({
                userAvatarPath: data
            });
             console.log(elem.state.userAvatarPath);
        })
        .catch(error => {
            console.error(error);
        }); */
        console.log(name);
        let initialLetter = name.charAt(0);
        console.log(initialLetter);
        return (
            <span class="fallback-letter">{initialLetter}</span>
        );
    }

    showAllSkills(e) {
      e.preventDefault();
      this.setState({
        showAllSkills: !(this.state.showAllSkills)
      });
      e.target.classList.toggle("open");
    }

    openInfoLayer(i) {
      if (i == this.state.infoLayerAt) {
        this.closeInfoLayer();
      }
      else {
        this.setState({
          infoLayerAt: i //set Layer to index of clicked item
        });
      }
    }

    closeInfoLayer() {
      this.setState({
        infoLayerAt: null //set Layer to index of clicked item
      });
    }

    openEditLayer(i) {
      if (!this.props.checkLogin()) {
        console.log("user needs to login");
        return;
      }
      this.setState({
        editLayerAt: i //set Layer to index of clicked item
      });
    }

    closeEditLayer() {
      this.setState({
        editLayerAt: null //set Layer to index of clicked item
      });
    }

    handleEdit(skill, skillLvl, willLvl) {
        this.props.handleEdit(skill, skillLvl, willLvl);
    }

    renderSkills(data, i) {
        return(
            <div>
                <p class="skill-name" key={i} >{data.name}</p>
                <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel}</span></p>
            {
                //open Edit-Layer on clicked Item
                this.state.infoLayerAt == i ?
                <div class="edit-layer">
                    <p>{data.name}</p>
                    <a onClick={this.openEditLayer.bind(null, i)}>Bearbeiten</a>
                    <a>Entfernen</a>
                    <a onClick={this.closeInfoLayer}>X</a>
                </div> : ""
            }
            {
                this.state.editLayerAt == i ?
                    <Editor skillName={data.name} handleAccept={this.handleEdit} handleClose={this.closeEditLayer.bind(this)} />
                : ""
            }
            </div>
        );
    }

    render() {
        return(
            <ul class="profile-information">
                <li class="info">
                    <div class="avatar">{this.loadAvatar(this.props.data.firstName)}</div>
                    <p class="name">{this.props.data.firstName} {this.props.data.lastName}</p>
                    <p class="id">{this.props.data.id}</p>
                    <p class="department">{this.props.data.title}</p>
                    <p class="location phone">{this.props.data.location} / TEL. {this.props.data.phone}</p>
                    <a class="mail" href={`mailto:${this.props.data.mail}`} target="_blank">MAIL</a>
                    <a class="move" href={`http://move.sinner-schrader.de/?id=${this.props.data.id}`} target="_blank">MOVE</a>
                    <a class="hangout" href="https://hangouts.google.com/" target="_blank">HANGOUT</a>
                </li>
                <li class="searched-skills skill-listing">
                    <div class="listing-header">Gesuchte Skillls</div>
                    <ul class="skills-list">
                    {this.props.data.skills.map((data, i) => {
                        if ( i <= 3)
                        return(
                            <li key={i} class="skill-item">
                                <p class="skill-name">{data.name}</p>
                                <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                            </li>
                        );
                    })}
                    </ul>
                </li>
                <li class="top-wills skill-listing ">
                    <div class="listing-header">Top Willls</div>
                    <ul class="skills-list">
                    {this.props.data.skills.map((data, i) => {
                        if ( i <= 3)
                        return(
                            <li key={i} class="skill-item">
                                <p class="skill-name">{data.name}</p>
                                <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                            </li>
                        );
                    })}
                    </ul>
                </li>
                <li class="all-skills skill-listing">
                    <div class="listing-header">Alle Skillls</div>
                    <ul class="skills-list closed">
                        {this.props.data.skills.map((data, i) => {
                            //Display Show-More-Link after maximum Skills to Show
                            if (this.state.showAllSkills) {
                                 return( <li class="skill-item" onClick={this.openInfoLayer.bind(null, i)}>{this.renderSkills(data, i)}</li>);;
                            }
                            else {
                                if ( i <= (this.state.skillsToShow)) {
                                    return( <li class="skill-item" onClick={this.openInfoLayer.bind(null, i)}>{this.renderSkills(data, i)}</li>);
                                }
                            }
                        })}
                    </ul>
                    <a class="show-more-link" onClick={this.showAllSkills} href="">MORE</a>
                </li>
            </ul>
        )
}
}
