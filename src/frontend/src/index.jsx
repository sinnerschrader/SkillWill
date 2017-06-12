import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import ReduxPromise from 'redux-promise'
import thunk from 'redux-thunk'

import reducers from './reducers'

import App from './app.jsx'
import SkillSearch from './components/search/skill-search.jsx'
import Layer from './components/layer/layer.jsx'
import MyProfile from './components/profile/my-profile.jsx'
import OthersProfile from './components/profile/others-profile.jsx'
import Login from './components/login/login.jsx'
import Logout from './components/logout/logout.jsx'

const store = createStore(
	combineReducers(
		Object.assign(
			{},
			reducers,
			{ routing: routerReducer }
		)
	),
	{
		searchTerms: [],
		skills: [],
		locationFilter: 'all',
		lastSortedBy: 'fitness'
	},
	applyMiddleware(
		ReduxPromise,
		thunk
	)
)

const history = syncHistoryWithStore(browserHistory, store)

render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="profile" component={Layer}>
					<Route path=":id" component={OthersProfile} />
				</Route>
				<Route path="my-profile" component={Layer}>
					<Route path="login" component={Login} />
					<Route path="logout" component={Logout} />
					<Route path=":id" component={MyProfile}>
						<Route path="add-skill" component={SkillSearch} />
					</Route>
				</Route>
			</Route>
		</Router>
	</Provider>, document.querySelector("#app")
)