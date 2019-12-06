import React, { Component } from "react";
import './main.css'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: ""
        }

        this.searchTextHandler = this.searchTextHandler.bind(this);
    }

    searchTextHandler(e) {
        if(this.state.searchText !== e.target.value) {
            this.setState({ searchText: e.target.value });
        }
    }

    render() {
        return (
            <div id="body">
                <div id="topbar">
                    <button class="button" id="login">Log in</button>
                </div>
                <br />
                <center>
                    <img id="logo" src="./logo-large.png"></img>
                    <h1>Heel-Me-Down</h1>
                    <div id="searchbar">
                        <input id="innersearch" maxlength="9" placeholder="e.g. ENGL 105L" value={this.state.searchText}/>
                    </div>
                    <a href="search-results/index.html">
                        <button class="button">Search</button>
                    </a>
                </center>
            </div>
        );
    }
}

export default Home;