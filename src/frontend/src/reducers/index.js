import {
	combineReducers
} from 'redux'
import {
	FETCH_RESULTS,
	FETCH_SKILLS,
	ADD_SEARCH_TERMS,
	DELETE_SEARCH_TERM,
	SET_LOCATION_FILTER,
	GET_PROFILE_DATA,
	ADD_SKILL_SEARCH,
	DELETE_SKILL_SEARCH,
	TOGGLE_SKILLS_EDIT_MODE,
	EDIT_SKILL,
	EXIT_SKILLS_EDIT_MODE,
	CLEAR_USER_DATA,
	SET_SORTED_USERS,
	SET_FILTERED_USERS
} from '../actions'

function setSearchTerms(state = [], action) {
	switch (action.type) {
		case ADD_SEARCH_TERMS:
			return state.concat(action.payload)
		case DELETE_SEARCH_TERM:
			return state.filter(searchTerm => searchTerm !== action.payload)
		default:
			return state
	}
}

function setSkillSearchTerms(state = [], action) {
	switch (action.type) {
		case ADD_SKILL_SEARCH:
			return action.payload
		case DELETE_SKILL_SEARCH:
			return []
		default:
			return state
	}
}

function setLocationFilter(state = [], action) {
	switch (action.type) {
		case SET_LOCATION_FILTER:
			console.log('ap',action.payload)
			return action.payload
		default:
			return state
	}
}

function fetchResultsBySearchTerms(state = [], action) {
	switch (action.type) {
		case FETCH_RESULTS:
			return {
				state,
				user: action.payload.results,
				searched: action.payload.searched
			}
		default:
			return state
	}
}

function fetchSkillsBySearchTerm(state = [], action) {
	switch (action.type) {
		case FETCH_SKILLS:
			return [...action.payload.map(skill => skill.name)]
		default:
			return state
	}
}

function getUserProfileData(state = {}, action) {
	switch (action.type) {
		case GET_PROFILE_DATA:
			return Object.assign({}, state, action.payload, {
				userLoaded: true
			})
		case CLEAR_USER_DATA:
			return Object.assign({}, {
				userLoaded: false
			})
		default:
			return state
	}
}

function editSkill(state = {}, action) {
	switch (action.type) {
		case EDIT_SKILL:
			return action.payload
		default:
			return state
	}
}

function sortedAndFilteredUsers(state = [], action) {
	switch (action.type) {
		case SET_SORTED_USERS:
			return {...state, sortedUsers: action.sortedUsers, lastSortedBy: action.lastSortedBy}
			case SET_FILTERED_USERS:
				return {...state, sortedUsers: action.sortedUsers}
		default:
			return state
	}
}

function setSkillsEditMode(state = false, action) {
	switch (action.type) {
		case TOGGLE_SKILLS_EDIT_MODE:
			if (state) {
				return false
			} else {
				return true
			}
		case EXIT_SKILLS_EDIT_MODE:
			return false
		default:
			return state
	}
}

function shouldSkillsAnimate(state = true, action) {
	switch (action.type) {
		case FETCH_RESULTS:
			return true
		case TOGGLE_SKILLS_EDIT_MODE:
			return false
		default:
			return state
	}
}

export default {
	searchTerms: setSearchTerms,
	locationFilter: setLocationFilter,
	results: fetchResultsBySearchTerms,
	user: getUserProfileData,
	skills: fetchSkillsBySearchTerm,
	skillSearchTerms: setSkillSearchTerms,
	isSkillEditActive: setSkillsEditMode,
	editSkill,
	shouldSkillsAnimate,
	sortedAndFilteredUsers
};