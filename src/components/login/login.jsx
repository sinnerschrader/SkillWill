import React from 'react';
import config from '../../config.json';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
      errormessage: undefined
    }

    this.handleUserchange = this.handleUserchange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

handleUserchange(e) {
  this.setState({user: e.target.value})
}

handlePasswordChange(e) {
  this.setState({password: e.target.value})
}

handleSubmit(e) {
  e.preventDefault();
  let postData = new FormData();
  postData.append("username", this.state.user)
  postData.append("password", this.state.password)

  fetch(config.backendServer + "/login", {method: "POST", body: postData})
  .then(res => {
    if (res.status == 200) {
      this.setState({user: undefined, password: undefined, errormessage: undefined})
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
    console.log("foo");
    this.props.onRetrieveSession(data.session)
  })
  .catch(err => console.log(err))
}

  render() {
    return(
      <div class="login">
        <form onSubmit={this.handleSubmit}>
          <input autocomplete="off" placeholder="LDAP User" type="text" value={this.state.user} onChange={this.handleUserchange}></input>
          <input autocomplete="off" placeholder="password" type="password" value={this.state.password} onChange={this.handlePasswordChange}></input>
          <br />
          <input autocomplete="off" placeholder="password" type="submit" value="Let's did it"></input>
          <input autocomplete="off" placeholder="password" type="button" value="Mission Abort!" onClick={this.props.onClose}></input>
          <br />
          <p>{this.state.errormessage}</p>
        </form>
      </div>
    )
  }
}
