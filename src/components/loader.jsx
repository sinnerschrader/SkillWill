import React from 'react';
import styles from '../styles.less';

export default class Loader extends React.Component {
    constructor() {
        super();
        this.state = {
            idk: 0,
            allSkills: [],
            skills: [],
            firstName: '',
            active: false,
            id: '',
            eMail: ''
        };
        this.getData = this.getData.bind(this);
        this.getSkills = this.getSkills.bind(this);
    }

    getData(e, value) {
        fetch("http://localhost:1337/" + value)
        .then(function(response) {
            console.log("test");
            return response.json();
        })
        .then(function(data) {
            e.setState({allSkills: data});
        })
        .catch(function() {
            console.error("getData" + e);
        });
    }

    getUserData(e, value) {
        fetch("http://localhost:1337/" + value)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            e.setState({
            skills: data.skills,
            firstName: data.firstName,
            lastName: data.lastName,
            active: data.active,
            id: data.id,
            eMail: data.eMail
            });
        })
        .catch(function(e) {
            console.error("getUserDataError: " + e);
        });
    }

    getSkills(e) {
        e.getData(e, "skills");
        return(
            <ul>
            {e.state.allSkills.map((data) => {
            return (<li key={data}>{data}</li>);
            })}
            </ul>
        )
    }

    getUsers(e) {
        console.log("getUsers");
        e.getUserData(e, "users/foobar");
        return(
            <ul>
                <li>id: {e.state.id}</li>
                <li>firstName: {e.state.firstName}</li>
                <li>lastName: {e.state.lastName}</li>
                <li>active: {`${e.state.active}`}</li>
                <li>eMail: {e.state.eMail}</li>
                {e.state.skills.map((data, i) => {
                    return(
                        <li key={i}>
                            <ul>
                                <li>name: {data.name}</li>
                                <li>skillLevel: {data.skillLevel}</li>
                                <li>willLevel: {data.willLevel}</li>
                            </ul>
                        </li>
                    );
                })}
            </ul>
        )
    }

    render() {
        return(
        <div>
            <h2>Alle Skills: </h2>
            <div>{this.getSkills(this)}</div>
            <h2>Beispiel User: </h2>
            <div>{this.getUsers(this)}</div>
        </div>
        )
    }
}
