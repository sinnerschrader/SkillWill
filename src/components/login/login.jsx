import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: undefined,
      password: undefined
    }

  }


  render() {
    return(
      <div class="login">
        <form>
          <input autocomplete="off" placeholder="LDAP User" type="text" value=""></input>
        </form>
      </div>
    )
  }
}
