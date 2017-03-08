import React from 'react';
import User from "../user/user.jsx";
import config from '../../config.json';
import Editor from '../editor/editor.jsx'

export default class ProfileInformation extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
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
        this.props.handleEdit(this.props.thisElem, skill, skillLvl, willLvl);
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
                    <a href="" onClick={this.closeInfoLayer}>X</a>
                    <a onClick={this.openEditLayer.bind(null, i)}>Bearbeiten</a>
                    <a>Entfernen</a>
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