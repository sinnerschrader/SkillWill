import React from 'react';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false
        }   
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        this.setState({
            isNavOpen: !this.state.isNavOpen
        })
    }

    render() {
        return(
            //markup is inspired by the s2-website navigation 
            <header class="mod-navigation-container">
                <div class={`mod-navigation nav-open-is-${this.state.isNavOpen}`}>
                    <a class="s2-logo" href="/"></a>
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
                                <a class="nav-link" href="/">Suche</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/my-profile/">Dein Profil</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        )
    }
}
