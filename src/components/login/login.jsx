import React from 'react'
import config from '../../config.json'
import Cookies from 'react-cookie'
import { Router, Link, browserHistory } from 'react-router'

export default class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: Cookies.load("user"),
			password: undefined,
			errormessage: undefined,
			isUserLogedIn: false
		}

		this.handleUserchange = this.handleUserchange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.retrieveSession = this.retrieveSession.bind(this)
	}

	componentWillMount(){
		if(this.state.isUserLogedIn){
			browserHistory.push("/my-profile/" + this.state.user)
		}
	}

	handleUserchange(e) {
		this.setState({user: e.target.value})
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value})
	}

	handleSubmit(e) {
		e.preventDefault()
		let postData = new FormData()
		postData.append("username", this.state.user)
		postData.append("password", this.state.password)

		fetch(config.backendServer + "/login", {method: "POST", body: postData})
			.then(res => {
				if (res.status == 200) {
					this.setState({password: undefined, errormessage: undefined})
					return res.json()
				} else if (res.status == 401) {
					this.setState({user: undefined, password: undefined, errormessage: "User/Passwort falsch"})
					throw Error(res.statusText)
				} else {
					this.setState({user: undefined, password: undefined, errormessage: "Da ging was nicht"})
					throw Error(res.statusText)
				}
		})
		.then(data => {
			this.retrieveSession(data.session)
		})
		.catch(err => console.log(err))
	}

	retrieveSession(session) {
			if (!session) {
				throw Error("session is unknown")
			}

			Cookies.save("session", session, { path: '/' })
			Cookies.save("user", this.state.user, { path: '/' })
			this.setState({ loginLayerOpen: false, session: session, isUserLogedIn: true })
			browserHistory.push("/my-profile/" + this.state.user)
	}

	render() {
		return(
			<div class="login">
				<h1 class="subtitle">Haaalt stop! Erstmal einloggen!</h1>
				<form onSubmit={this.handleSubmit}>
							<input autocomplete="off" placeholder="LDAP User" type="text" value={this.state.user} onChange={this.handleUserchange}></input>
							<input autocomplete="off" placeholder="password" type="password" value={this.state.password} onChange={this.handlePasswordChange}></input>
							<input class="submit-btn" autocomplete="off" placeholder="password" type="submit" value="Let's did it"></input>
							<p class="error">{this.state.errormessage}</p>
				</form>
			</div>
		)
	}
}
