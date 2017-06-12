import config from '../config.json'

export const ADD_SEARCH_TERMS = 'ADD_SEARCH_TERMS'
export function addSearchTerms(searchTerms) {
	return {
		type: ADD_SEARCH_TERMS,
		payload: searchTerms
	}
}

export const DELETE_SEARCH_TERM = 'DELETE_SEARCH_TERM'
export function deleteSearchTerms(searchTerm) {
	return {
		type: DELETE_SEARCH_TERM,
		payload: searchTerm
	}
}

export const SET_LOCATION_FILTER = 'SET_LOCATION_FILTER'
export function setLocationFilter(locationFilter) {
	return {
		type: SET_LOCATION_FILTER,
		payload: locationFilter
	}
}

export const SET_LAST_SORTED_BY = 'SET_LAST_SORTED_BY'
export function setLastSortedBy(sortFilter, lastSortedBy) {
	return {
		type: SET_LAST_SORTED_BY,
		sortFilter,
		lastSortedBy
	}
}
export function setSortFilter(criterion) {
	return function (dispatch, getState){
		const { sortFilter } = getState().lastSortedBy
		dispatch(setLastSortedBy(criterion, sortFilter))
	}
}

export const FETCH_RESULTS = 'FETCH_RESULTS'
export function fetchResults(searchTerms) {
	const requestURL = `${config.backendServer}/users?skills=${searchTerms}`
	const options = {
		credentials: 'same-origin'
	}
	const request = fetch(requestURL, options).then(response => response.json())
	return {
		type: FETCH_RESULTS,
		payload: request
	}
}

export function getUserBySearchTerms(term, method) {
	return function (dispatch, getState) {

		if (method === 'delete') {
			dispatch(deleteSearchTerms(term))
		} else {
			dispatch(addSearchTerms(term))
		}
		const {
			searchTerms,
			lastSortedBy
		} = getState()
		dispatch(fetchResults(searchTerms))
		dispatch(setSortFilter(lastSortedBy))
	}
}

export const ADD_SKILL_SEARCH = 'ADD_SKILL_SEARCH'
export function addSkillSearch(searchTerm) {
	return {
		type: ADD_SKILL_SEARCH,
		payload: searchTerm
	}
}

export const DELETE_SKILL_SEARCH = 'DELETE_SKILL_SEARCH'
export function deleteSkillSearch(searchTerm) {
	return {
		type: DELETE_SKILL_SEARCH,
		payload: searchTerm
	}
}

export const FETCH_SKILLS = 'FETCH_SKILLS'
export function fetchSkills(searchTerm) {
	const requestURL = `${config.backendServer}/skills?search=${searchTerm}`
	const options = {
		credentials: 'same-origin'
	}
	const request = fetch(requestURL, options).then(response => response.json())
	return {
		type: FETCH_SKILLS,
		payload: request
	}
}

export function getSkillsBySearchTerm(term, method) {
	return function (dispatch, getState) {
		if (method === 'delete') {
			dispatch(deleteSkillSearch(term))
		} else {
			dispatch(addSkillSearch(term))
		}
		const {
			skillSearchTerms
		} = getState()
		dispatch(fetchSkills(skillSearchTerms))
	}
}

export const GET_PROFILE_DATA = 'GET_PROFILE_DATA'
export function getUserProfileData(profile) {
	const requestURL = `${config.backendServer}/users/${profile}`
	const options = {
		credentials: 'same-origin'
	}
	const request = fetch(requestURL, options).then(response => response.json())
	return {
		type: GET_PROFILE_DATA,
		payload: request
	}
}

export const CLEAR_USER_DATA = 'CLEAR_USER_DATA'
export function clearUserData() {
	return {
		type: CLEAR_USER_DATA,
		payload: {}
	}
}

export const TOGGLE_SKILLS_EDIT_MODE = 'TOGGLE_SKILLS_EDIT_MODE'
export function toggleSkillsEditMode() {
	return {
		type: TOGGLE_SKILLS_EDIT_MODE
	}
}
export const EXIT_SKILLS_EDIT_MODE = 'EXIT_SKILLS_EDIT_MODE'
export function exitSkillsEditMode() {
	return {
		type: EXIT_SKILLS_EDIT_MODE
	}
}

export const EDIT_SKILL = 'EDIT_SKILL'
export function editSkill(requestURL, options) {
	const request = fetch(requestURL, options).then(response => response.json())
	return {
		type: EDIT_SKILL,
		payload: request
	}
}