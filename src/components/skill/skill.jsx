 import React from 'react';
 import { Router, Route, Link } from 'react-router'
 import Editor from '../editor/editor.jsx'
 import config from '../../config.json';

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

    render() {
        return(
            <ul class={`skill ${this.state.editorIsOpen ? `toggled` :""}`}>
                <li class="name" onClick={this.toggleEditor}>
                    {this.props.data.name}
                </li>
                <li class="add" onClick={this.toggleEditor}>+</li>
                { this.state.editorIsOpen?
                    <li class="editor-container">
                        <Editor skillName={this.props.data.name} handleAccept={this.handleEdit} handleClose={this.toggleEditor} handleEdit={this.props.handleEdit}/>
                    </li>
                    :""
                }
            </ul>
        )
    }
}
