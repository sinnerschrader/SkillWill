import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';
import UserSearch from './components/search/user-search.jsx';
import Results from './components/results/results.jsx'
import SkillSearch from './components/search/skill-search.jsx';
import Layer from './components/layer/layer.jsx';
import MyProfile from './components/profile/my-profile.jsx';
import OthersProfile from './components/profile/others-profile.jsx';
import Login from './components/login/login.jsx';
import Logout from './components/logout/logout.jsx';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

render(
	<AppContainer>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<Route path="search" name="search" component={Results} />
				<Route path="profile" component={Layer}>
					<Route path=":id" component={OthersProfile} />
				</Route>
				<Route path="my-profile" component={Layer}>
					<Route path="login" component={Login} />
					<Route path="logout" component={Logout} />
					<Route path=":id" component={MyProfile}>
						<Route path="add-skill" component={Login} />
					</Route>
				</Route>
			</Route>
		</Router>
	</AppContainer>, document.querySelector("#app")
);
