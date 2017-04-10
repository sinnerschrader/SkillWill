import React from 'react'

export default class Results extends React.Component {
	constructor(props) {
		super(props)
		this.scrollToResults = this.scrollToResults.bind(this)
	}
	scrollToResults(e) {
		e.preventDefault()
		const scrollTo = e.target
		scrollTo.scrollIntoView({behavior: "smooth"})
	}

	render() {
		if (this.props.results.length > 0) {
			return(
				<div class="results-container">
					<a class="counter" onClick={this.scrollToResults}>
						<span>{this.props.results.length} Ergebnisse</span>
					</a>
					<ul class="results">
						{this.props.results.map((data, i) => {
							return (
								<li class="result-item" key={i}>
									{React.cloneElement(this.props.children, { data: data })}
							</li>
							)
						})}
					</ul>
				</div>
			)
		}
		else {
			return (
				<div class="results-container" data-isEmptyLabel={this.props.noResultsLabel}></div>
			)
		}
	}
}

