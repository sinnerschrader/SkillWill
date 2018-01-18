import {
	FETCH_RESULTS,
	FETCH_SKILLS,
	ADD_SEARCH_TERMS,
	DELETE_SEARCH_TERM,
	SET_LOCATION_FILTER,
	SET_LAST_SORTED_BY,
	ADD_SKILL_SEARCH,
	DELETE_SKILL_SEARCH,
	TOGGLE_SKILLS_EDIT_MODE,
	EDIT_SKILL,
	EXIT_SKILLS_EDIT_MODE,
	CLEAR_USER_DATA,
	SET_DIRECTION_FILTER,
	START_ANIMATING,
	STOP_ANIMATING,
	SORT_USER_SKILLS_DESC,
	SORT_USER_WILLS_DESC,
	SORT_USER_SKILLS_BY_NAME,
	REQUEST_CURRENT_USER,
	RECEIVE_CURRENT_USER,
	SET_COMPANY_FILTER,
	REQUEST_PROFILE_DATA,
	RECEIVE_PROFILE_DATA
} from '../actions'

function sortSkillsUserHelper(user, criterion, order = 'asc') {
	let skills = {}
	if (user.lastSortedBy === criterion) {
		skills = [...user.sortedSkills]
		skills.reverse()
	} else {
		skills = [...user.skills]
		skills.sort((a, b) => {
			if (order === 'asc') {
				return a[criterion].toString().toUpperCase() <
				b[criterion].toString().toUpperCase()
					? -1
					: 1
			} else {
				return a[criterion].toString().toUpperCase() <
				b[criterion].toString().toUpperCase()
					? 1
					: -1
			}
		})
	}

	return skills
}

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

function isResultsLoaded(state = false, action) {
	switch (action.type) {
		case FETCH_RESULTS:
			return true
		default:
			return state
	}
}

function fetchResultsBySearchTerms(state = [], action) {
	switch (action.type) {
		case FETCH_RESULTS:
			return {
				...state,
				users: action.payload.results,
				searched: action.payload.searched.map(element => element['found']),
				input: action.payload.searched.map(element => element['input']),
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
		case RECEIVE_PROFILE_DATA:
			return {
				...state,
				...action.payload,
				loaded: true,
				topWills: sortSkillsUserHelper(action.payload, 'willLevel', 'desc'),
				sortedSkills: sortSkillsUserHelper(action.payload, 'skillLevel', 'desc'),
				lastSortedBy: 'skillLevel'
			}
		case SORT_USER_SKILLS_DESC:
			return Object.assign({}, state, action.payload, {
				sortedSkills: sortSkillsUserHelper(action.payload, 'skillLevel', 'desc'),
				lastSortedBy: 'skillLevel'
			})
		case SORT_USER_WILLS_DESC:
			return Object.assign({}, state, action.payload, {
				sortedSkills: sortSkillsUserHelper(action.payload, 'willLevel', 'desc'),
				lastSortedBy: 'willLevel'
			})
		case SORT_USER_SKILLS_BY_NAME:
			return Object.assign({}, state, action.payload, {
				sortedSkills: sortSkillsUserHelper(action.payload, 'name', 'asc'),
				lastSortedBy: 'name'
			})
		case CLEAR_USER_DATA:
		case REQUEST_PROFILE_DATA:
			return {
				loaded: false
			}
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

function lastSortedBy(state = {}, action) {
	switch (action.type) {
		case SET_LAST_SORTED_BY:
			return {
				sortFilter: action.sortFilter,
				lastSortedBy: action.lastSortedBy,
			}
		default:
			return state
	}
}

function locationFilter(state = '', action) {
	switch (action.type) {
		case SET_LOCATION_FILTER:
			return action.payload
		case SET_COMPANY_FILTER:
			return 'all'
		default:
			return state
	}
}

function companyFilter(state = 'all', action) {
	switch (action.type) {
		case SET_COMPANY_FILTER:
			return action.filter
		default:
			return state
	}
}

function directionFilter(state = '', action) {
	switch (action.type) {
		case SET_DIRECTION_FILTER:
			return action.payload
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

function isSkillAnimated(state = true, action) {
	switch (action.type) {
		case START_ANIMATING:
			return true
		case STOP_ANIMATING:
			return false
		default:
			return state
	}
}

function currentUser(state = {
	loaded: false
}, action) {
	switch(action.type) {
		case REQUEST_CURRENT_USER:
			return {
				...state,
				loaded: false
			}
		case RECEIVE_CURRENT_USER:
			return {
				...state,
				loaded: true,
				...action.payload
			}
		default:
			return state
	}
}

export default {
	searchTerms: setSearchTerms,
	results: fetchResultsBySearchTerms,
	user: getUserProfileData,
	skills: fetchSkillsBySearchTerm,
	skillSearchTerms: setSkillSearchTerms,
	isSkillEditActive: setSkillsEditMode,
	editSkill,
	shouldSkillsAnimate,
	lastSortedBy,
	locationFilter,
	directionFilter,
	isResultsLoaded,
	isSkillAnimated,
	currentUser,
	companyFilter
}
