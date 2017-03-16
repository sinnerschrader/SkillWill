import React from 'react';

export default function sortAlphabetically(items) {
    console.log(items);
    items.sort(a, b => {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
        return -1;
        }
        if (nameA > nameB) {
        return 1;
        }
        // names must be equal
        return 0;
    });
}