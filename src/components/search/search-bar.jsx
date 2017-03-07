 import React from 'react';
 import { Router, Route, Link } from 'react-router'

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',
            searchTerms: this.props.searchTerms
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            currentValue : e.target.value
        });     
    }

    handleKeyDown(e) {
        //remove recently added searchTerm on Backspace
        if (this.state.currentValue == "" && e.keyCode == 8 && this.state.searchTerms != "") {
        this.setState ({
            searchTerms: this.state.searchTerms.slice(0,(this.state.searchTerms.length-1))  
        });
        this.props.handleRequest(this.props.parent, this.state.searchTerms);
        }
    }

    handleClose(j) {
        let helperArray= [];
        let helperIndex = 0;
        this.state.searchTerms.map((searchTerm, i) => {
        //skip deleted term
        if (i != j) {
            helperArray[helperIndex] = searchTerm;
            helperIndex++;
        }
        });
        this.setState({
            searchTerms: helperArray
        });

        this.props.toggleUpdate(false);

        // update searchTerms, if there is an unsubmitted searchinput 
        if (this.state.currentValue.length != 0) {
            this.setState({
                searchTerms: helperArray.concat([this.state.currentValue]),
                currentValue : ""
            });
        } 
        // refresh search
        this.props.handleRequest(this.props.parent, this.state.searchTerms);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.currentValue.length != 0) {
            this.setState({
                searchTerms: this.state.searchTerms.concat([this.state.currentValue]),
                currentValue : ""
            });
        } 
        this.props.handleRequest(this.props.parent,this.state.searchTerms);
    }
      // update component only if search has changed
    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.currentValue.length !== nextState.currentValue) ) {
            return true;
        }
        return false;
    }
    
    render() {
        return(
            <form onSubmit={this.handleSubmit} name="SearchBar" autocomplete="off">
            <div class="search-container">
                <div class="input-container">
                    {
                    // display entered searchTerms in front of the input field
                    this.state.searchTerms.map((searchTerm, i) => {
                        return(
                        <div class="search-term" >
                            {searchTerm}
                            <a class="close" key={i} onClick={this.handleClose.bind(null, i)}>&#9747;</a>
                        </div>
                        );
                    })
                    }
                <input name="SearchInput"  autocomplete="off" placeholder="Nach welchem Skill suchst du?" type="search" value={this.state.currentValue} autofocus="true" onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
                </div>
                <button type="submit" class="search" />
            </div>
        </form>
        )
    }
}