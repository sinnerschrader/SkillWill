import React from 'react'

export default class Results extends React.Component {
	constructor(props) {
		super(props)
		 this.state = {
      sortCriterion: 'fitness'
    };
		this.scrollToResults = this.scrollToResults.bind(this)
		this.sortResults = this.sortResults.bind(this)
		this.onSortByNameClick = this.onSortByNameClick.bind(this)
		this.onSortByLocationClick = this.onSortByLocationClick.bind(this)
		this.onSortByFitnessClick = this.onSortByFitnessClick.bind(this)

	}
	results = this.props.results

	onSortByNameClick(){
		this.sortResults('lastName')
	}
	onSortByLocationClick(){
		this.sortResults('location')
	}
	onSortByFitnessClick(){
		this.sortResults('fitness')
	}

	scrollToResults(e) {
		e.preventDefault()
		const scrollTo = e.target
		scrollTo.scrollIntoView({behavior: "smooth"})
	}

	sortResults(criterion){
		if (this.state.lastSortedBy === criterion) {
			this.results = this.props.results.reverse()
		} else if (criterion === 'fitness') {
			this.results = this.props.results.sort((a,b) => {
				return a[criterion] > b[criterion] ? -1 : 1
			})
		} else {
			this.results = this.props.results.sort((a,b) => {
				return a[criterion] < b[criterion] ? -1 : 1
			})
		}
		this.forceUpdate()

	this.setState({
		sortOrder: this.state.sortOrder,
		lastSortedBy: criterion
	})
	}


	Component = this.props.component

	render() {
		if (this.results.length > 0) {
			return(
				<div class="results-container">
					<a class="counter" onClick={this.scrollToResults}>
						<span>{this.results.length} Ergebnisse</span>
					</a>
					<ul class="results">
						<ul class="sort-buttons">
						<li class="sort-button-name" onClick={this.onSortByNameClick}>Sort by Name</li>
						<li class="sort-button-location" onClick={this.onSortByLocationClick}>Sort by Location</li>
						<li class="sort-button-fitness" onClick={this.onSortByFitnessClick}>Sort by Fitness</li>
						</ul>
						{this.results.map((data, i) => {
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

