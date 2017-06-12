import React from 'react'

export default function sortAndFilter(list, sort, direction, filter) {
	if (direction === 'asc') {
		list.sort((a, b) => {
			return a[sort] < b[sort] ? -1 : 1
		})
	} else {
		list.sort((a, b) => {
			return a[sort] > b[sort] ? -1 : 1
		})
	}
const filteredList = filterList(list, filter)
return filteredList
}

function filterList(list, filter) {
	return list.filter(user => {
		if (filter === 'all') {
			return true
		} else {
			return user.location === filter
		}
	})
}