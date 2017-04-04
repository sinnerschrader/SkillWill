import React from 'react'
import { Router, Link, browserHistory } from 'react-router'

export default class Layer extends React.Component {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
        //return to home if current page is login
        if (this.props.location.pathname.startsWith('/my-profile')) {
            browserHistory.push("/")
        } else {
            browserHistory.goBack()
        }
        document.body.classList.remove('layer-open')
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
