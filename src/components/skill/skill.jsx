 import React from 'react';
 import { Router, Route, Link } from 'react-router'
 import Editor from '../editor/editor.jsx'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorIsOpen: false
        }
        this.toggleEditor = this.toggleEditor.bind(this);
    }

    toggleEditor(e) {
        this.setState({
            editorIsOpen: !this.state.editorIsOpen
        })
    }

    handleEdit(skill, skillLvl, willLvl) {
      fetch(config.backendServer + "/users/"+ this.state.userId + "?" + this.state.session + "&skill=" + skill + "&skill_level" + skillLvl + "&will_level" + willLvl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
        })
        .catch(function(error) {
            console.error(error);
        });
    }
    
    render() {
        return(
            <ul class="user">
                <li class="info">
                    <span class="name" id={`${this.props.data.name}`}>{this.props.data.name}</span>
                </li>
                <li><a onClick={this.toggleEditor}>+</a></li>
                { this.state.editorIsOpen?
                    <li>
                        <Editor skillName={this.props.data.name} handleAccept={this.handleEdit} handleClose={this.toggleEditor} />
                    </li>
                    :""
                }
            </ul>  
        )
    }
}