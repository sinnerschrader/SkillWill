 import React from 'react'
 import { Router, Route, Link } from 'react-router'
 import Editor from '../editor/editor.jsx'
 import config from '../../config.json'
 import Cookies from 'react-cookie'

export default class Skill extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorIsOpen: false,
            userId: undefined,
            skillLvl: 0,
            willLvl: 0
        }
        this.toggleEditor = this.toggleEditor.bind(this)
        this.checkSkillLvls = this.checkSkillLvls.bind(this)

        this.checkSkillLvls()
    }

    toggleEditor(e) {
        this.setState({
            editorIsOpen: !this.state.editorIsOpen
        })
    }

    // check if Skill is allready in Profile
    // if so, set current levels to Editor
    checkSkillLvls() {
        this.props.userData.skills.map( (data) => {
            if (data.name ==  this.props.data.name) {
                this.setState({
                    skillLvl: data.skillLevel,
                    willLvl: data.willLevel
                })
            }
        })
    }

    render() {
        return(
            <ul class={`skill ${this.state.editorIsOpen ? `toggled` :""}`}>
                <li class="name" onClick={this.toggleEditor}>
                    {this.props.data.name}
                </li>
                <li class="add" onClick={this.toggleEditor}></li>
                { this.state.editorIsOpen ?
                    <li class="editor-container">
                        <Editor skillName={this.props.data.name}
																skillLvl={this.state.skillLvl}
																willLvl={this.state.willLvl}
																handleAccept={this.props.handleEdit}
																handleClose={this.toggleEditor}
																handleEdit={this.props.handleEdit}/>
                    </li>
                    :""
                }
            </ul>
        )
    }
}
