import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';
import UserSearch from './components/search/user-search.jsx';
import SkillSearch from './components/search/skill-search.jsx';
import Layer from './components/layer/layer.jsx';
import Profile from './components/profile/profile.jsx';
import Login from './components/login/login.jsx';
import { Router, Route, Link, browserHistory } from 'react-router';
import { IndexRoute } from 'react-router'

render( 
  <AppContainer>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={UserSearch} />
        <Route path="search" component={UserSearch}>
            <Route path="profile" component={Layer}>
              <Route path=":id" component={Profile} />
            </Route>
        </Route>  
        <Route path="/myProfile" component={Layer}>
          <Route path=":id" component={Profile} />
          <Route path="/login" component={Login} />
        </Route>
        <Route path="profile" component={Layer}>
          <Route path=":id" component={Profile} />
        </Route>
      </Route>
    </Router>
  </AppContainer>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./app.jsx', () => {
    const App = require('./app.jsx').default;
    render(
      <AppContainer>
        <Router history={browserHistory}>
          <Route path="/" component={App} />
        </Router>
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}
