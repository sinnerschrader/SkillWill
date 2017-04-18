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
		this.handleLogin = this.handleLogin.bind(this)
		this.retrieveSession = this.retrieveSession.bind(this)
		this.saveCookies = this.saveCookies.bind(this)
		this.generatePostData = this.generatePostData.bind(this)
		this.handleResponseStatus = this.handleResponseStatus.bind(this)
	}

	componentWillMount(){
		if(this.state.isUserLogedIn){
			browserHistory.push(`/my-profile/${this.state.user}`)
		}
	}

	handleUserchange(e) {
		this.setState({user: e.target.value})
	}

	handlePasswordChange(e) {
		this.setState({password: e.target.value})
	}

	generatePostData(){
		const postData = new FormData()
		postData.append("username", this.state.user)
		postData.append("password", this.state.password)
		return postData
	}

	saveCookies(session){
		Cookies.save("session", session, { path: '/' })
		Cookies.save("user", this.state.user, { path: '/' })
	}

	retrieveSession(session) {
		if (!session) {
			throw Error("session is unknown")
		}
		this.saveCookies(session)
		this.setState({
			loginLayerOpen: false,
			session: session,
			isUserLogedIn: true
		})
		browserHistory.push(`/my-profile/${this.state.user}`)
	}

	handleResponseStatus(response){
		if (response.status == 200) {
			this.setState({
				password: undefined,
				errormessage: undefined
			})
			return true
		} else if (response.status == 401) {
			this.setState({
				user: undefined,
				password: undefined,
				errormessage: "User/Passwort falsch"
			})
			throw Error(response.statusText)
		} else {
			this.setState({
				user: undefined,
				password: undefined,
				errormessage: "Da ging was nicht"
			})
			throw Error(response.statusText)
		}
	}

	handleLogin(event) {
		event.preventDefault()
		const postData = this.generatePostData()
		const options = {
			method: "POST",
			body: postData
		}
		fetch(`${config.backendServer}/login`, options)
			.then(response => {
				if(this.handleResponseStatus(response)){
					return response.json()
				}
			})
			.then(data => this.retrieveSession(data.session))
		.catch(err => console.log(err))
	}

	render() {
		return(
			<div class="login">
				<h1 class="subtitle">Haaalt stop! Erstmal einloggen!</h1>
				<form onSubmit={this.handleLogin}>
					<input
						name="username"
						placeholder="LDAP User"
						type="text"
						value={this.state.user}
						onChange={this.handleUserchange}>
					</input>
					<input
						name="password"
						placeholder="password"
						type="password"
						value={this.state.password}
						onChange={this.handlePasswordChange}>
					</input>
					<input
						class="submit-btn"
						type="submit"
						value="Login">
					</input>
					<p class="error">{this.state.errormessage}</p>
				</form>
			</div>
		)
	}
}
