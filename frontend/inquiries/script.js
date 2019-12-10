class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: null,
            height: null,
            isLoaded: false,
            user: {},
            searchStr: "",
            searchSel: null,
            suggestions: [],
            inputActive: false,
            burgerActive: false,
            optionsActive: false,
            selectedItem: null,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        let newState = this.state;
        newState.user = this.getUser();
        newState.items = []; // getItems(user.searchStr);
        this.setState(newState);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getUser() {
        return {
            isLoggedIn: true,
            id: 42069,
            searchStr: "AMST 125",
        };
    }

    render() {
        const { isLoaded } = this.state;

        return (
        <Navbar
            setState={(state) => this.setState(state)}
            inquiries={() => {}}
            toggleLog={() => {}}
            user={isLoaded ? user : "Loading..."}
            suggestions={this.state.suggestions}
            searchStr={this.state.searchStr}
            searchSel={this.state.searchSel}
            navInput={this.state.navInput}
            devWidth={this.state.width}
            inputActive={this.state.inputActive}
            optionsActive={this.state.optionsActive}
            burgerActive={this.state.burgerActive}
        />
        );
    }
}

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    searchChange(str) {
        let { searchSel, suggestions, navInput, searchStr } = this.props;
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
        this.props.setState({ searchStr: searchStr, suggestions: suggestions, searchSel: searchSel });
        navInput.focus();
    }

    searchSubmit() {
        let { searchSel, suggestions, navInput, searchStr } = this.props;
        if (searchSel != null) {
            this.searchChange(suggestions[searchSel]);
            searchSel = null;
        } else if (this.toBareBones(searchStr).length > 4) {
            // newState.items = getItems(newState.searchStr);
            $(navInput).blur();
            console.log("getItems", searchStr)
            this.props.getItems(this.toBareBones(searchStr.replace(/[0-9]/g, '')), this.toBareBones(searchStr.replace(/\D/g,'')));
            this.props.setState({
                searchSel: searchSel,
            });
        }
    }

    searchKeyDown(e) {
        e.stopPropagation();
        let { searchSel, suggestions, navInput, searchStr } = this.props;
        switch (e.keyCode) {
        case 38: // up
            e.preventDefault();
            if (searchSel > 0) searchSel--;
            break;
        case 40: // down
            e.preventDefault();
            if (searchSel == null) searchSel = 1;
            else if (searchSel != suggestions.length-1) searchSel++;
            break;
        case 27: // escape
            $(navInput).blur();
            break;
        }
        if (searchSel != null && searchStr.length < 5) searchStr = suggestions[searchSel];
        this.props.setState({ searchSel: searchSel, searchStr: searchStr });
    }

    toBareBones(str) {
        if (!str) return str;
        return str.toLowerCase().replace(/ /g, '').replace(/-/g, '').replace(/_/g, '');
    }

    renderSuggestions(inputWidth) {
        let { inputActive, suggestions, searchSel } = this.props;
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

    render() {
        const inputWidth = parseInt($(".navbar-start .input").css("width"));

        return (
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
            <NavbarBrand
                burgerClick={() => this.props.setState({burgerActive: !this.props.burgerActive})}
                burgerActive={this.props.burgerActive}
            />
            <NavbarMenu
                setState={(state) => this.props.setState(state)}
                handleChange={this.searchChange.bind(this)}
                handleSubmit={this.searchSubmit.bind(this)}
                handleKeyDown={this.searchKeyDown.bind(this)}
                suggClick={() => this.searchChange()}
                suggestions={(this.props.suggestions.length!=1 || !this.props.searchStr || !this.props.inputActive) ?
                this.renderSuggestions(inputWidth) : (
                    <div>
                    {this.renderSuggestions(inputWidth)}
                    <div className="autocomp" style={{marginTop: "15pt", marginLeft: inputWidth*.17, width: inputWidth*.66}}>
                        <p>No results found.</p>
                    </div>
                    </div>
                )}
                searchStr={this.props.searchStr}
                nameInput={(inp) => !this.props.navInput?this.props.setState({navInput: inp}):null}
                burgerActive={this.props.burgerActive}
                devWidth={this.props.devWidth}
                handleFocusChange={() => this.props.setState({inputActive: !this.props.inputActive})}
            />
            {this.props.burgerActive || this.props.devWidth >= 1024 ?
            <NavbarEnd
                user={this.props.user}
                inquiries={this.props.inquiries}
                toggleLog={this.props.toggleLog}
                toggleOptions={() => this.props.setState({optionsActive: !this.props.optionsActive})}
                optionsActive={this.props.optionsActive}
                devWidth={this.props.devWidth}
            />
            :null}
        </nav>
        );
    }
}

function NavbarBrand(props) {
    return (
    <div className="navbar-brand">
        <a className="navbar-item" href="../index.html">
            <img src="../imgs/logo-small.png" />
        </a>
        <a
            role="button"
            className={"navbar-burger burger".concat(props.burgerActive?" is-active":"")}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => props.burgerClick()}>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
        </a>
    </div>
    );
}

function NavbarMenu(props) {
    return (
    <div className={"navbar-menu".concat(props.burgerActive&&props.devWidth<1024?"is-active":"")}>
        <div className="navbar-start">
            <div className="navbar-item">
                <div className="control has-icons-left">
                    <input
                        className="input is-rounded"
                        placeholder="e.g. ENGL 105L"
                        value={props.searchStr?props.searchStr:''}
                        onChange={(e) => props.handleChange($(e.target).val())}
                        onKeyPress={(e) => e.key=="Enter"?props.handleSubmit():null}
                        onKeyDown={(e) => props.handleKeyDown(e)}
                        onClick={(e) => props.handleChange($(e.target).val())}
                        onBlur={() => setTimeout(props.handleFocusChange, 100)}
                        onFocus={() => props.handleFocusChange()}
                        ref={(inp) => props.nameInput(inp)}
                    />
                    <span className="icon is-left">
                        <i className="fas fa-search"></i>
                    </span>
                    <div className="suggestions">
                    {props.suggestions}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

function NavbarEnd(props) {
    return (
    <div className="navbar-end">
        <div className="navbar-item">
            <div className="navbar-item">
                <h2 className="greeting">Hello, {props.user.id}</h2>
            </div>
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link" onClick={() => props.toggleOptions()}>
                    {/* <h3>Options</h3> */}
                    <img src="../imgs/options.png" />
                </a>
                <div className="navbar-dropdown is-right">
                    {props.optionsActive || props.devWidth >= 1024 ?
                    <div>
                    <a
                        className="navbar-item"
                        href="../inquiries/index.html"
                        onClick={() => props.inquiries()}>
                            Inquiries
                    </a>
                    <hr className="navbar-divider" />
                    <a
                        className="navbar-item"
                        href="../index.html"
                        onClick={() => props.toggleLog()}>
                            {props.user ? "Log Out" : "Log In"}
                    </a>
                    </div>
                    :null}
                </div>
            </div>
        </div>
    </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));