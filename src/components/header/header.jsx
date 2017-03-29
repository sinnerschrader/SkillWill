import React from 'react' 
import Cookies from 'react-cookie'
import { Router, Link, browserHistory } from 'react-router'  

export default class Header extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            isNavOpen: false,
            userId: undefined
        }   
        this.handleClick = this.handleClick.bind(this) 
        this.checkUserIdCookie = this.checkUserIdCookie.bind(this) 

        this.checkUserIdCookie() 
    }

    handleClick(e){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        })
        this.checkUserIdCookie() 
    }

    checkUserIdCookie() {
      let u =  Cookies.load("user") 
      if (u != this.state.userId) {
        this.setState({userId: u})
      }
      return !!u 
    }

    render() {
        return(
            //markup is inspired by the s2-website navigation 
            <header class="mod-navigation-container">
                <div class={`mod-navigation nav-open-is-${this.state.isNavOpen}`}>
                    <Link class="s2-logo" to="/"></Link>
                    <label class="burger" title="Show navigation" onClick={this.handleClick}>
                        <div class="burger-layer-wrapper">
                            <span class="burger-layer"></span>
                            <span class="burger-layer"></span>
                            <span class="burger-layer"></span>
                            <span class="burger-layer"></span>
                        </div>
                    </label>
                    <nav class="nav">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <Link class="nav-link" to="/">Suche</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" to={`/my-profile/${this.state.userId}`}>Dein Profil</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        )
    }
}
