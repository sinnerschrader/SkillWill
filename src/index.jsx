import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';
import SearchBar from './components/searchBar/searchBar.jsx';
import Profile from './components/profile/profile.jsx';
import { Router, Route, Link, browserHistory } from 'react-router';
import { IndexRoute } from 'react-router'

render( 
  <AppContainer>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
       <IndexRoute component={SearchBar} />
       <Route path="search" component={SearchBar}>
        <Route path="profile/:id" component={Profile}></Route>
       </Route>  
       <Route path="profile/:id" component={Profile}></Route>
      </Route>
    </Router>
  </AppContainer>, document.querySelector("#app"));

if (module && module.hot) {
  module.hot.accept('./app.jsx', () => {
    const App = require('./app.jsx').default;
    render(
      <AppContainer>
        <Router history={browserHistory}>
          <Route path="/" component={App}> </Route>
        </Router>
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}
