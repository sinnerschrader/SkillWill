import React from 'react';
import User from "../user/user.jsx";
import config from '../../config.json';
import Editor from '../editor/editor.jsx';
import { Router, Link, browserHistory } from 'react-router';

export default class BasicProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userAvatarPath: "",
        showAllSkills:  this.props.showAllSkills,
        infoLayerAt: this.props.openLayerAt,
        editLayerAt: null,
        skillsToShow: 6
      }
       this.showAllSkills = this.showAllSkills.bind(this);
       this.openInfoLayer = this.openInfoLayer.bind(this);
       this.closeInfoLayer = this.closeInfoLayer.bind(this);
       this.renderSkills = this.renderSkills.bind(this);
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
        let initialLetter = name.charAt(0);
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
          infoLayerAt: i, //set Layer to index of clicked item
        });
      }
    }

    closeInfoLayer() {
      this.setState({
        infoLayerAt: -1 //unset Layer
      });
    }

    renderSkills(data, i) {
        return (
            <div>
                {this.state.infoLayerAt == i? <div class="close-layer" onClick={this.closeInfoLayer}></div> : ""}
                <p class="skill-name" key={i} onClick={this.openInfoLayer.bind(null, i)}>{data.name}</p>
                <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel}</span></p>
            {
                //open Info-Layer on clicked Item
                this.state.infoLayerAt == i ?
                <div class="info-layer">
                    <p>{data.name}</p>
                    {
                        // for my-profile only
                        this.props.infoLayer(data, i, this.state.showAllSkills)
                    }
                    <a class="close-btn-small" onClick={this.closeInfoLayer}>X</a>
                </div>
                : ""
            }
            </div>
        );
    }

    render() {
        return(
            <ul class="basic-profile">
                <li class="info">
                    <div class="avatar">{this.loadAvatar(this.props.data.firstName)}</div>
                    <p class="name">{this.props.data.firstName} {this.props.data.lastName}</p>
                    <p class="id">{this.props.data.id}</p>
                    <p class="department">{this.props.data.title}</p>
                    <p class="location phone">{this.props.data.location} / TEL. {this.props.data.phone}</p>
                    <Link class="mail" href={`mailto:${this.props.data.mail}`} target="_blank">MAIL</Link>
                    <Link class="move" href={`http://move.sinner-schrader.de/?id=${this.props.data.id}`} target="_blank">MOVE</Link>
                    <Link class="hangout" href={`https://sinnerschrader.slack.com/messages/@${this.props.data.firstName.toLowerCase()}.${this.props.data.lastName.toLowerCase()}`} target="_blank">SLACK</Link>
                </li>

                {
                    this.props.additionalSkillListing // e.g. searched skills
                }

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

                            //display show-more-link after maximum skills to show
                            if (this.state.showAllSkills) {
                                 return( <li class="skill-item" >{this.renderSkills(data, i)}</li>);;
                            }
                            else {
                                if ( i <= (this.state.skillsToShow)) {
                                    return( <li class="skill-item">{this.renderSkills(data, i)}</li>);
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
