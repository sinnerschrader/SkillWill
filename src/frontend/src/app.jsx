// eslint-disable-next-line no-unused-vars
import React from 'react'
import IconSymbols from './components/icon/icon-symbols.jsx'
import Header from './components/header/header.jsx'
import Logo from './components/logo/logo.jsx'
import Footer from './components/footer/footer.jsx'
import UserSearch from './components/search/user-search.jsx'
import Results from './components/results/results.jsx'
import { connect } from 'react-redux'
import { login } from './actions'

class App extends React.Component {

	render() {
		const { isResultsLoaded, isSkillAnimated } = this.props
		return (
			<div className={isResultsLoaded ? 'results-loaded' : ''}>
				<IconSymbols />
				<Header />
				<div className="search">
					<Logo />
					<div className="container">
						<UserSearch location={this.props.location} />
					</div>
				</div>
				<div className="content">
					<Results animated={isSkillAnimated} />
					{this.props.children}
				</div>
				<Footer />
				<div className="layer-overlay" />
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		isResultsLoaded: state.isResultsLoaded,
		isSkillAnimated: state.isSkillAnimated,
	}
}
export default connect(mapStateToProps)(App)
