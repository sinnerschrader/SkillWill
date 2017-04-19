import React from 'react'

export default class Results extends React.Component {
	constructor(props) {
		super(props)
		 this.state = {
			lastSortedBy: 'fitness',
			results: this.props.results
		};
		this.scrollToResults = this.scrollToResults.bind(this)
		this.sortResults = this.sortResults.bind(this)
	}

	scrollToResults() {
		const searchbarRect = document.querySelector('.searchbar').getBoundingClientRect()
		window.scrollBy({ top: `${searchbarRect.top-10}`, behavior: "smooth"})
	}

	sortResults(criterion){
		let results
		if (this.state.lastSortedBy === criterion) {
			results = this.props.results.reverse()
		} else if (criterion === 'fitness') {
			results = this.props.results.sort((a,b) => {
				return a[criterion] > b[criterion] ? -1 : 1
			})
		} else {
			results = this.props.results.sort((a,b) => {
				return a[criterion] < b[criterion] ? -1 : 1
			})
		}
		this.forceUpdate()

		this.setState({
			sortOrder: this.state.sortOrder,
			lastSortedBy: criterion,
			results: results
		})
	}

	render() {
		const { results } = this.state
		if (results.length > 0) {
			return(
				<div class="results-container">
					<a class="counter" onClick={this.scrollToResults}>
						<span>{results.length} Ergebnisse</span>
					</a>
					<ul class="results">
						<ul class="sort-buttons">
						<li class="sort-button-name" onClick={() => this.sortResults('name')}>Sort by Name</li>
						<li class="sort-button-location" onClick={() => this.sortResults('location')}>Sort by Location</li>
						<li class="sort-button-fitness" onClick={() => this.sortResults('fitness')}>Sort by Fitness</li>
						</ul>
						{results.map((data, i) => {
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

