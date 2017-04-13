import React from 'react'

export default class Results extends React.Component {
	constructor(props) {
		super(props)
		 this.state = {
      sortCriterion: 'fitness',
      sortOrder: 'asc'
    };
		this.scrollToResults = this.scrollToResults.bind(this)
		this.sortResults = this.sortResults.bind(this)
		this.onSortByNameClick = this.onSortByNameClick.bind(this)

	}
	results = this.props.results

	onSortByNameClick(){
		this.sortResults('lastName',this.state.sortOrder)
	}

	scrollToResults(e) {
		e.preventDefault()
		const scrollTo = e.target
		scrollTo.scrollIntoView({behavior: "smooth"})
	}

	sortResults(criterion, order){
		this.results = this.props.results.sort((a,b) =>{
			if(a[criterion] < b[criterion]){
				return -1
			} else if(a[criterion] > b[criterion]){
				return 1
			} else {
				if (a.id < b.id){
					return -1
				} else {
					return 1
				}
			}
		})
		this.forceUpdate()
	console.log(this.props.results)
	console.log(this.results)
	this.setState({
		sortOrder: this.state.sortOrder
	})
	console.log(this.state.sortOrder)
	}

	shouldComponentUpdate(nextProps, nextState){
		console.log(nextProps, nextState)
	}
	Component = this.props.component

	render() {
		console.log(this.results)

		if (this.results.length > 0) {
			return(
				<div class="results-container">
					<a class="counter" onClick={this.scrollToResults}>
						<span>{this.results.length} Ergebnisse</span>
					</a>
					<div class="sort"
						onClick={this.onSortByNameClick}
						//onSortByNameClick={this.sortResults}
						>Sort by Name</div>
					<ul class="results">
						{this.results.map((data, i) => {
							return (
								<li class="result-item" key={i}>
									{React.cloneElement(this.props.children, { data: data })}
									{console.log(data)}
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

// class ResultsTable extends React.Component {
// 		constructor(props) {
// 		super(props)
// 	}

// 	render(){
// 		return(

// 		)
// 	}
// }

