import React from 'react';
import User from "../user/user.jsx";
import ProfileInformation from "./profile-information.jsx";
import config from '../../config.json';

export default class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: "id",
        dataLoaded: false,
        data: null
      }
      this.removeSkill = this.removeSkill.bind(this);
      this.sortAlphabetically = this.sortAlphabetically.bind(this);
    }
    componentDidMount() {
      const elem = this;
        elem.setState({
          userId: elem.props.params.id
      });

      fetch(config.backendServer + "/users/"+ elem.state.userId)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            elem.setState({
              data: data,
              dataLoaded: true
            });
        })
        .catch(function(error) {
            console.error(error);
        });

        sortAlphabetically(this.state.data.skills);
    }

     sortAlphabetically(items) {
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

    removeSkill(skill) {
      fetch(config.backendServer + "/users/"+ this.state.userId + "?" + this.state.session +"&skill=" + skill)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
        })
        .catch(function(error) {
            console.error(error);
        });
    }

render() {
    return(
      <div class="profile-container">
        <a  href="../../" class="close-btn">X</a>
        <div class="profile">
          {
            this.state.dataLoaded ? 
              <ProfileInformation data={this.state.data} handleRemove={this.removeSkill} />
              : <p>please wait</p>
          }
        </div>
      </div>
    )
  }
}
