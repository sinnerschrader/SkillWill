import React from 'react';

export default function setInitialStateFromURL(queryObject) {
	if(typeof queryObject.skills !== 'undefined'){
		const {location, skills} = queryObject
		const dropdownLabel = typeof location != 'undefined' ? location : 'Alle Standorte'
		const queryArray = convertQueryParamsToArray(skills)
		const locationString = convertLocationToString(location)

		return({
			searchItems: queryArray,
			locationString: locationString,
			dropdownLabel: dropdownLabel
		})
	} else {
		return({
			searchItems: [],
			locationString: '',
			dropdownLabel: 'Alle Standorte'
		})
	}
}

function convertQueryParamsToArray(skills){
	if (typeof skills != 'undefined' && skills.length !== 0){
		return skills.split(',')
	} else {
		return []
	}
}

function convertLocationToString(location){
	if (typeof location !== 'undefined'){
		return `&location=${location}`
	} else {
		return ''
	}
}
