import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';
import UserSearch from './components/search/user-search.jsx';
import SkillSearch from './components/search/skill-search.jsx';
import Layer from './components/layer/layer.jsx';
import MyProfile from './components/profile/my-profile.jsx';
import OthersProfile from './components/profile/others-profile.jsx';
import Login from './components/login/login.jsx';
import { Router, Route, Link, browserHistory } from 'react-router';
import { IndexRoute } from 'react-router'

render( 
  <AppContainer>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={UserSearch} />
        <Route path="search(&:searchTerms)" name="search" component={UserSearch}>
            <Route path="profile" component={Layer}>
              <Route path=":id" component={OthersProfile} />
            </Route>
        </Route>  
        <Route path="my-profile" component={Layer}>
          <Route path="login" component={Login} />
          <Route path=":id" component={MyProfile}>
            <Route path="add-skill" component={Login} />
          </Route>
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
