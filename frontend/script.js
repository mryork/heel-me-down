class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: null,
            height: null,
            searchStr: "",
            searchSel: null,
            suggestions: [],
            inputActive: false,
            navInput: null,
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    searchChange(str) {
        let { searchSel, suggestions, navInput, searchStr } = this.state;
        let depts = getDepts().map(dept => {
            return dept.code;
        });
        let inputStr = this.toBareBones(str);
        searchStr = str;
        if (inputStr) {
            suggestions = [str].concat(depts.filter(sug => {
                return this.toBareBones(sug).includes(inputStr) || inputStr.includes(this.toBareBones(sug));
            }).slice(0, 10));
        } else {
            suggestions = [];
        }
        searchSel = null;
        this.setState({ searchStr: searchStr, suggestions: suggestions, searchSel: searchSel });
        navInput.focus();
        console.log(this.state)
    }

    searchSubmit() {
        let { searchSel, suggestions, navInput, searchStr } = this.state;
        let bareSearchStr = this.toBareBones(searchStr);
        if (searchSel != null) {
            this.searchChange(suggestions[searchSel]);
            searchSel = null;
        } else if (bareSearchStr.length > 4 && suggestions.length > 1) {
            $(navInput).blur();
            console.log("getItems", searchStr, suggestions.length)
            this.setState({
                searchSel: searchSel,
            });
            this.loadSearchResults(bareSearchStr);
        }
        console.log(this.state)
    }
    loadSearchResults(str) {
        window.location.href = "/frontend/search-results?s=".concat(str);
    }

    searchKeyDown(e) {
        e.stopPropagation();
        let { searchSel, suggestions, navInput, searchStr } = this.state;
        switch (e.keyCode) {
        case 38: // up
            e.preventDefault();
            if (searchSel > 0) searchSel--;
            break;
        case 40: // down
            e.preventDefault();
            if (searchSel == null && suggestions.length > 1) searchSel = 1;
            else if (searchSel == null) searchSel = 0;
            else if (searchSel != suggestions.length-1) searchSel++;
            break;
        case 27: // escape
            $(navInput).blur();
            break;
        }
        if (searchSel != null && searchStr.length < 5) searchStr = suggestions[searchSel];
        this.setState({ searchSel: searchSel, searchStr: searchStr });
        console.log(this.state)
    }

    toBareBones(str) {
        if (!str) return str;
        return str.toLowerCase().replace(/ /g, '').replace(/-/g, '').replace(/_/g, '');
    }

    renderSuggestions(inputWidth) {
        let { inputActive, suggestions, searchSel } = this.state;
        if (!inputActive) return '';
        return suggestions.map((sug, key) => {
            return (
            <div
                key={key}
                className={"autocomp".concat(searchSel==key?" selected":"")}
                style={{marginTop: key*15+"pt", marginLeft: inputWidth*.17, width: inputWidth*.66}}
                onClick={() => {this.searchChange(sug); this.searchSubmit();}}>
                    <p>{sug}</p>
            </div>
            );
        });
    }
    
    nameInput(inp) {
        if (!this.state.navInput) this.setState({navInput: inp})
    }

    render() {
        const { searchStr } = this.state;
        const inputWidth = parseInt($("#search .input").css("width"));

        return (
        <div id="search" className="columns is-centered is-vcentered">
            <div className="column is-half">
                <img id="logo" src="imgs/logo-large.png" />
                <h1>Heel-Me-Down</h1>
                <div className="control has-icons-left has-icons-right">
                    <input
                        className="input is-medium is-rounded"
                        placeholder="e.g. ENGL 105L"
                        value={searchStr?searchStr:''}
                        onChange={(e) => this.searchChange($(e.target).val())}
                        onKeyPress={(e) => e.key=="Enter"?this.searchSubmit():null}
                        onKeyDown={(e) => this.searchKeyDown(e)}
                        onClick={(e) => this.searchChange($(e.target).val())}
                        onBlur={() => setTimeout(() => this.setState({inputActive: !this.state.inputActive}), 100)}
                        onFocus={() => this.setState({inputActive: !this.state.inputActive})}
                        ref={(inp) => this.nameInput(inp)}
                    />
                    {(this.state.suggestions.length!=1 || !searchStr || !this.state.inputActive) ?
                    this.renderSuggestions(inputWidth) : (
                        <div>
                        {this.renderSuggestions(inputWidth)}
                        <div className="autocomp" style={{marginTop: "15pt", marginLeft: inputWidth*.17, width: inputWidth*.66}}>
                            <p>No results found.</p>
                        </div>
                        </div>
                    )}
                    <span className="icon is-left">
                        <i className="fas fa-search"></i>
                    </span>
                    <span className="icon is-right"></span>
                </div>
                <a href="search-results/index.html">
                    <button className="button" onClick={() => this.searchSubmit()}>Search</button>
                </a>
            </div>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));