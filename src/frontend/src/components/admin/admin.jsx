import React from 'react'
import { connect } from 'react-redux'
import { getSkillsBySearchTerm } from '../../actions'
import AdminList from '../../components/admin/admin-list/admin-list'
import AdminEditor from '../../components/admin/admin-editor/admin-editor'
import Layer from '../layer/layer'
import SearchBar from '../search/search-bar'
import Icon from '../icon/icon'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isAddNewActive: false }

		this.handleSearchBarInput = this.handleSearchBarInput.bind(this)
		this.handleSearchBarDelete = this.handleSearchBarDelete.bind(this)
		this.handleSetNew = this.handleSetNew.bind(this)
		this.handleAbortNew = this.handleAbortNew.bind(this)
	}

	componentWillMount() {
		document.body.classList.add('layer-full-open')
	}

	componentWillUnmount() {
		document.body.classList.remove('layer-full-open')
	}

	handleSetNew() {
		this.setState({ isAddNewActive: true })
	}

	handleAbortNew() {
		this.setState({ isAddNewActive: false })
	}

	handleSearchBarInput(newSearchTerms) {
		this.handleAbortNew()
		this.props.getSkillsBySearchTerm(newSearchTerms)
	}

	handleSearchBarDelete(deleteItem) {
		this.props.getSkillsBySearchTerm(deleteItem, 'delete')
	}

	render() {
		const { skillSearchTerms } = this.props
		const { isAddNewActive } = this.state

		return (
			<Layer>
				<div className="admin">
					<div className="searchbar">
						<h2>Skill administration</h2>
						<p className="search-description">
							Which skill do you want to add or change?
						</p>

						<SearchBar
							variant="skill"
							onInputChange={this.handleSearchBarInput}
							onInputDelete={this.handleSearchBarDelete}
							parent={this}
							searchTerms={skillSearchTerms}
						/>
					</div>

					{isAddNewActive ? (
						<AdminEditor handleAbort={this.handleAbortNew} />
					) : (
						<div>
							<AdminList searchTerms={skillSearchTerms} />

							<div className="admin__add">
								<h4 className="admin__add-title">Searched skill not found?</h4>
								<button
									className="admin__button admin__button--has-label admin__button--xlarge"
									onClick={this.handleSetNew}>
									<Icon name="plus" width={20} height={20} />Add new skill
								</button>
							</div>
						</div>
					)}
				</div>
			</Layer>
		)
	}
}

function mapStateToProps(state) {
	return { skillSearchTerms: state.skillSearchTerms }
}

export default connect(mapStateToProps, { getSkillsBySearchTerm })(Admin)
