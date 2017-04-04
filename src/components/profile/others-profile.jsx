import React from 'react'
import { Router, Link, browserHistory } from 'react-router'
import BasicProfile from "./basic-profile.jsx"
import config from '../../config.json'
import sortAlphabetically from '../../libs/sortAlphabetically.jsx'

export default class OthersProfile extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        userId: "id",
        data: null,
        dataLoaded: false,
        infoLayerAt: 0
      }
      this.searchedSkills = this.searchedSkills.bind(this)
    }

    componentDidMount() {
      const elem = this
        elem.setState({
          userId: elem.props.params.id
      })

      fetch(config.backendServer + "/users/"+ elem.state.userId)
        .then(r => r.json())
        .then(function(data) {
            elem.setState({
              data: data,
              dataLoaded: true
            })

            let currData = eval(elem.state.data)
            elem.setState({
              data: currData
            })
        })
        .catch(function(error) {
            console.error(error)
        })
    }

    searchedSkills() {
        return(
            <li class="searched-skills skill-listing">
                <div class="listing-header">Gesuchte Skillls</div>
                <ul class="skills-list">
                {this.state.data.skills.map((data, i) => {
                    if ( i <= 3)
                    return(
                        <li key={i} class="skill-item">
                            <p class="skill-name">{data.name}</p>
                            <p class="level">skillLevel: <span>{data.skillLevel}</span></p><p>willLevel: <span>{data.willLevel }</span></p>
                        </li>
                    )
                })}
                </ul>
            </li>
        )
    }

    infoLayer(data) {
        //nothing to return
    }

    render() {
        return (
            <div class="profile">
                {this.state.dataLoaded ?
                    <div>
                        <BasicProfile data={this.state.data} infoLayer={this.infoLayer} additionalSkillListing={this.searchedSkills()} />
                        <sortAlphabetically items={this.state.data.skills} />
                    </div>
                    :""
                }
            </div>
        )
    }
}
