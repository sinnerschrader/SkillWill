import React from 'react';
import { Router, Link, browserHistory } from 'react-router';

export default class Layer extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() { 
        browserHistory.goBack();
    }

    render() {
        return (
            <div class="layer-container">
                <Link onClick={this.handleClose} class="close-layer"></Link>
                <Link onClick={this.handleClose} class="close-btn"></Link>
                <div class="layer">
                    {this.props.children}
                </div>
            </div>
        )
    }
}