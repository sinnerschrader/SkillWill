import React from 'react';
import { Router, Link, browserHistory } from 'react-router';

export default class Layer extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div class="layer-container">
                <Link to="/" class="close-layer"></Link>
                <Link to="/" class="close-btn">X</Link>
                <div class="layer">
                    {this.props.children}
                </div>
            </div>
        )
    }
}