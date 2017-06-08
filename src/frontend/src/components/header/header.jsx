import React from 'react'
import Cookies from 'react-cookie'
import { Router, Link, browserHistory } from 'react-router'

export default class Header extends React.Component {
	constructor(props) {
		super(props)
		this.checkUserIdCookie = this.checkUserIdCookie.bind(this)
	}
	componentDidMount() {
		this.checkUserIdCookie()
	}
	checkUserIdCookie() {
		const user = Cookies.load("user")
		if (user != this.state.userId) {
			this.setState({ userId: user })
		}
		return !!user
	}

	renderLogOut() {
		const user = Cookies.load("user")
		if (!!user) {
			return (
				<li className="nav-item">
					<Link
						onClick={this.handleClick}
						className="nav-link"
						to={`/my-profile/logout`}>
						Logout
					</Link>
				</li>
			)
		}
	}

	returnMyProfileLink() {
		if (typeof this.state.userId != 'undefined') {
			return this.state.userId
		} else {
			return 'login'
		}
	}

	render() {
		return(
			<header className="mod-navigation-container">
				<div className="mod-navigation">
					<Link className="s2-logo" to="/"></Link>
					<nav className="nav">
						<ul className="nav-list">
							<li className="nav-item">
								<Link className="nav-link" to={`/my-profile/${this.returnMyProfileLink()}`}>Dein Profil</Link>
							</li>
							{this.renderLogOut()}
						</ul>
					</nav>
				</div>
			</header>
		)
	}
}
