import React from 'react'
import config from '../../config.json'
import Cookies from 'react-cookie'
import { Router, Link, browserHistory } from 'react-router'

export default class Logout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: undefined,
      password: undefined,
      errormessage: undefined
    }
  }

	checkUserIdCookie() {
		const user =  Cookies.load("user")
		if (user != this.state.userId) {
			this.setState({userId: user})
		}
		return !!user
	}

	componentWillMount(){
		const session = Cookies.load("session")
		const postData = new FormData()
		postData.append("session", session)
		console.log('session',session)
		fetch(`${config.backendServer}/logout`, {method: "POST", body: postData})
			.then(response => {
				console.log('logout', Cookies.remove('session') )
				Cookies.remove('session', { path: '/' })
				Cookies.remove('user', { path: '/' })
				this.setState({userId: undefined, user: undefined})
				console.log(this.props.router)
		})
	}

  render() {
    return null
  }
}
