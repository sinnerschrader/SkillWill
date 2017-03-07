import React from 'react';
import User from "../user/user.jsx";
import config from '../../config.json';

export default class ProfileInformation extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showAllSkills: false,
        editLayerAt: null,
        skillsToShow: 6 
      }
       this.showAllSkills = this.showAllSkills.bind(this);
       this.openEditLayer = this.openEditLayer.bind(this);
       this.closeEditLayer = this.openEditLayer.bind(this);
    }

    showAllSkills(e) {
      e.preventDefault();
      this.setState({
        showAllSkills: !(this.state.showAllSkills)
      });
      e.target.classList.toggle("open");  
    }

    openEditLayer(i) {
      if (i == this.state.editLayerAt) {
        this.closeEditLayer();
      }
      else {
        this.setState({
          editLayerAt: i //set Layer to index of clicked item
        });
      }
    }

    closeEditLayer() {
      document.preventDefault();
      console.log("cloised");
      this.setState({
        editLayerAt: null //set Layer to index of clicked item
      });
    }

    render() {
    return(
        <ul class="user">
            <li class="info">
                <p class="name">{this.props.data.firstName} {this.props.data.lastName}</p>
                <span class="id">{this.props.data.id}</span><br/>
                <span class="department">{this.props.data.title}</span><br/>
            </li>
            <li class="searched-skills">
                <p>Gesuchte Skillls</p>
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
            <li class="all-skills">
                <p>Alle Skillls</p>
                <ul class="skills-list closed">
                    {this.props.data.skills.map((data, i) => { 
                        //Display Show-More-Link after maximum Skills to Show 
                        if (this.state.showAllSkills) {
                            return( 
                            <li class="skill-item" onClick={this.openEditLayer.bind(null, i)}>
                                <p class="skill-name" key={i}>{data.name}</p>
                                <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                                {
                                    //open Edit-Layer on clicked Item
                                    this.state.editLayerAt == i ?  
                                    <div class="edit-layer">
                                        <a onClick={this.closeEditLayer}>X</a>
                                        <a>Bearbeiten</a>
                                        <a onClick={this.props.handleRemove.bind(data.name)}>Entfernen</a>
                                    </div> : ""
                                }
                            </li>
                            )
                        }
                        else {
                            if ( i <= (this.state.skillsToShow)) { 
                                return( 
                                <li class="skill-item" onClick={this.openEditLayer.bind(null, i)}>
                                    <p class="skill-name" key={i} >{data.name}</p>
                                    <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                                {
                                    //open Edit-Layer on clicked Item
                                    this.state.editLayerAt == i ? 
                                    <div class="edit-layer">
                                    <a href="" onClick={this.closeEditLayer}>X</a>
                                    <a>Bearbeiten</a>
                                    <a>Entfernen</a>
                                    </div> : ""
                                }
                                </li>
                                );
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