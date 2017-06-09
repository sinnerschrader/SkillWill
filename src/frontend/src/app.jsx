import styles from './styles.less'
import React from 'react'
import Header from './components/header/header.jsx'
import Footer from './components/footer/footer.jsx'
import UserSearch from './components/search/user-search.jsx'
import Results from './components/results/results.jsx'

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Header />
				<div className="search">
					<div className="heading">
						<h1 className="title">skill/will</h1>
						<h3 className="subtitle">Wir haben Talent.</h3>
					</div>
					<div className="container">
						<UserSearch location={this.props.location} />
					</div>
				</div>
				<div className="content">
					<Results />
					{this.props.children}
				</div>
				<Footer />
				<div className="layer-overlay"></div>
			</div>
		)
	}
}
