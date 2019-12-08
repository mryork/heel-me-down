class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: null,
            height: null,
            isLoaded: false,
            user: {},
            currPage: 1,
            itemsPerPage: null,
            maxPage: null,
            items: [],
            searchStr: "",
            searchSel: null,
            suggestions: [],
            navInput: null,
            burgerActive: false,
            optionsActive: false,
            selectedItem: null,
            message: "",
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    };

    componentDidMount() {
        let newState = this.state;
        newState.isLoaded = true;
        newState.user = {
            isLoggedIn: true,
            id: 42069,
            settings: {
                itemsPerPage: 2,
            },
            searchStr: "AMST 125",
        }; // getUser();
        newState.items = [
            {
                id: 1,
                department: "AMST",
                number: "125",
                name: "textbook1",
                seller: "adam c.",
                date: "nov 20",
                materials: [
                    "red",
                    "green",
                    "blue",
                ],
                price: 10.99,
                amazonPrice: 11.99,
                sold: false,
            },
            {
                id: 6,
                name: "iclicker",
                seller: "adam c.",
                date: "nov 20",
                materials: [
                    "mean",
                    "naughty",
                    "wicked",
                ],
            },
            {
                id: 5,
                name: "boat",
                seller: "adam c.",
                date: "nov 20",
                materials: [
                    "mean",
                    "naughty",
                    "wicked",
                ],
            },
            {
                id: 10,
                name: "air",
                seller: "adam c.",
                date: "nov 20",
                materials: [
                    "white",
                    "green",
                    "blue",
                ],
            },
            {
                id: 65,
                name: "laptop",
                seller: "adam c.",
                date: "nov 20",
                materials: [
                    "tech",
                    "ML",
                    "IT",
                ],
            },
        ]; // getItems(user.searchStr);
        newState.itemsPerPage = newState.user.settings.itemsPerPage;
        newState.maxPage = Math.ceil(newState.items.length/newState.itemsPerPage);
        this.setState(newState);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    selectItem(itemId, e) {
        e.stopPropagation();
        let newState = this.state;
        newState.items.map((item, i) => {
            let newItem = item;
            newItem.selected = (item.id==itemId);
            newState.selectedItem = newItem.selected ? i : newState.selectedItem;
            item = newItem;
        });
        this.setState(newState);
    }

    deselectItems() {
        let newState = this.state;
        newState.items.map(item => {
            let newItem = item;
            newItem.selected = false;
            item = newItem;
        });
        newState.selectedItem = null;
        this.setState(newState);
    }

    goToPage(page) {
        let newState = this.state;
        if (page > 0 && page <= newState.maxPage) {
            newState.currPage = page;
        }
        this.setState(newState);
        this.deselectItems();
    }

    searchChange(str) {
        let newState = this.state;
        let depts = getDepts().map(dept => {
            return dept.code;
        });
        let inputStr = this.toBareBones(str);
        newState.searchStr = str;
        if (inputStr) {
            newState.suggestions = [str];
            if (inputStr.length < 5) {
                newState.suggestions = newState.suggestions.concat(depts.filter(sug => {
                    return this.toBareBones(sug).includes(inputStr);
                }).slice(0, 10));
            }
        } else {
            newState.suggestions = [];
        }
        newState.searchSel = null;
        this.setState(newState);
        this.state.navInput.focus();
    }

    searchSubmit() {
        let newState = this.state;
        if (newState.searchSel != null) {
            this.searchChange(newState.suggestions[newState.searchSel]);
            newState.searchSel = null;
        } else if (newState.searchStr.length > 4) {
            // newState.items = getItems(newState.searchStr);
            $(newState.navInput).blur();
        }
        this.setState(newState);
        console.log(newState.searchStr)
    }

    searchKeyDown(e) {
        e.stopPropagation();
        let newState = this.state;
        switch (e.keyCode) {
        case 38: // up
            e.preventDefault();
            if (newState.searchSel > 0) newState.searchSel--;
            break;
        case 40: // down
            e.preventDefault();
            if (newState.searchSel == null) newState.searchSel = 1;
            else if (newState.searchSel != newState.suggestions.length-1) newState.searchSel++;
            break;
        case 27: // escape
            $(newState.navInput).blur();
            break;
        }
        if (newState.searchSel != null && newState.searchStr.length < 5) newState.searchStr = newState.suggestions[newState.searchSel];
        this.setState(newState);
    }

    toBareBones(str) {
        if (!str) return str;
        return str.toLowerCase().replace(/ /g, '').replace(/-/g, '').replace(/_/g, '');
    }

    getItems(itemStr) {
        // (itemStr.replace(/[0-9]/g, ''), itemStr.replace(/\D/g,''))
    }

    burgerClick() {
        let newState = this.state;
        newState.burgerActive = !newState.burgerActive;
        this.setState(newState);
    }

    toggleOptions() {
        let newState = this.state;
        newState.optionsActive = !newState.optionsActive;
        this.setState(newState);
    }

    messChange(str) {
        let newState = this.state;
        newState.message = str;
        this.setState(newState);
    }

    messClick() {
        // sendMessage()
    }

    render() {
        const { isLoaded, user, items, currPage, maxPage } = this.state;
        return (
        <div>
        <Navbar
            user={isLoaded ? user : "Loading..."}
            settings={() => {}}
            inquiries={() => {}}
            toggleLog={() => {}}
            toggleOptions={this.toggleOptions.bind(this)}
            optionsActive={this.state.optionsActive}
            searchChange={this.searchChange.bind(this)}
            searchSubmit={this.searchSubmit.bind(this)}
            searchKeyDown={this.searchKeyDown.bind(this)}
            suggestions={this.state.suggestions}
            searchStr={this.state.searchStr}
            searchSel={this.state.searchSel}
            initNavInput={inp => !this.state.navInput?this.setState({navInput: inp}):null}
            navInput={this.state.navInput}
            burgerClick={this.burgerClick.bind(this)}
            burgerActive={this.state.burgerActive}
            devWidth={this.state.width}
        />
        <ListView
            items={isLoaded ? items.slice((currPage-1)*user.settings.itemsPerPage, currPage*user.settings.itemsPerPage) : []}
            totalItems={isLoaded ? items.length : -1}
            selectItem={this.selectItem.bind(this)}
            deselectItems={this.deselectItems.bind(this)}
            messChange={this.messChange.bind(this)}
            messClick={this.messClick.bind(this)}
        />
        <Pagination
            currPage={currPage}
            maxPage={isLoaded ? maxPage : currPage}
            goToPage={this.goToPage.bind(this)}
        />
        </div>
        );
    }
}

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSuggestions(inputWidth) {
        if (!$(".navbar-start .input").is(":focus")) return '';
        return this.props.suggestions.map((sug, key) => {
            return (
            <div
                key={key}
                className={"autocomp".concat(this.props.searchSel==key?" selected":"")}
                style={{marginTop: key*15+"pt", marginLeft: inputWidth*.17, width: inputWidth*.66}}
                onClick={() => {this.props.searchChange(sug); this.props.searchSubmit();}}>
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
                burgerClick={this.props.burgerClick}
                burgerActive={this.props.burgerActive}
            />
            <NavbarMenu
                handleChange={this.props.searchChange}
                handleSubmit={this.props.searchSubmit}
                handleKeyDown={this.props.searchKeyDown}
                suggestions={(this.props.suggestions.length!=1 || !this.props.searchStr || !$(".navbar-start .input").is(":focus")) ? this.renderSuggestions(inputWidth) : (
                    <div>
                    {this.renderSuggestions(inputWidth)}
                    <div className="autocomp" style={{marginTop: "15pt", marginLeft: inputWidth*.17, width: inputWidth*.66}}>
                        <p>No results found.</p>
                    </div>
                    </div>
                )}
                searchStr={this.props.searchStr}
                nameInput={this.props.initNavInput}
                burgerActive={this.props.burgerActive}
                devWidth={this.props.devWidth}
            />
            {this.props.burgerActive || this.props.devWidth >= 1024 ?
            <NavbarEnd
                user={this.props.user}
                inquiries={this.props.inquiries}
                settings={this.props.settings}
                toggleLog={this.props.toggleLog}
                toggleOptions={this.props.toggleOptions}
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
                        ref={(inp) => props.nameInput(inp)}
                    />
                    <span className="icon is-left">
                        <i className="fas fa-search"></i>
                    </span>
                    {props.suggestions}
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
                <h2>Hello, {props.user.id}</h2>
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
                        href="../settings/index.html"
                        onClick={() => props.settings()}>
                            Settings
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

class ListView extends React.Component {
    constructor(props) {
        super(props);
    }

    renderItem(item, key) {
        return (
            <ListItem
                id={item.id}
                itemName={item.name}
                sellerName={item.seller}
                postDate={item.date}
                materials={item.materials}
                selectItem={this.props.selectItem}
                isSelected={item.selected}
                messChange={this.props.messChange}
                messClick={this.props.messClick}
                key={key}
            />
        );
    }

    render() {
        const { items, totalItems } = this.props;
        return (
        <div className="listView" onClick={() => this.props.deselectItems()}>
            <div id="itemCount" className="columns is-centered">
                <div className="column is-two-thirds">
                    {totalItems ? <p>Your search yielded {totalItems} results.</p> : <p>Loading...</p>}
                </div>
            </div>
            {items.map((item, key) => this.renderItem(item, key))}
        </div>
        );
    }
}

function ListItem(props) {
    return (
    <div className={"columns is-centered ".concat(props.isSelected?"selected":"")}>
        <div className="column listing is-two-thirds" onClick={(e) => props.selectItem(props.id, e)}>
            <div className="columns is-centered">
                <div className="column is-2 itemImg">
                    <img src="../imgs/logo-gray.png" />
                </div>
                <div className="column is-8 itemInfo">
                    <h1>{props.itemName}</h1>
                    <h2>{props.sellerName}</h2><h2>{props.postDate}</h2>
                    {props.materials.map((mat, key) => {
                        return <p key={key}>{mat}</p>
                    })}
                </div>
                <div className="column is-2 itemImg">
                    <img src="../imgs/logo-gray.png" />
                </div>
            </div>
            {props.isSelected ? 
            <div className="columns is-centered buyItem">
                <div className="column is-1"></div>
                <div className="column is-10">
                    <div className="field">
                        <label className="label">Message</label>
                        <div className="control">
                            <textarea
                                className="textarea has-fixed-size"
                                placeholder="e.g. Is the item still available?"
                                rows="3"
                                onChange={(e) => props.messChange($(e.target).val())}
                            />
                        </div>
                    </div>
                    <div className="field is-grouped is-grouped-right">
                        <button
                            className="button is-success"
                            onClick={() => props.messClick()}>
                                Submit
                        </button>
                    </div>
                </div>
                <div className="column is-1"></div>
            </div>
            :null}
        </div>
    </div>
    );
}

function Pagination(props) {
    return (
    <nav className="pagination" role="navigation" aria-label="pagination">
        <a className="pagination-previous" disabled={props.currPage == 1} onClick={() => props.goToPage(props.currPage-1)}>Previous</a>
        <a className="pagination-next" disabled={props.currPage == props.maxPage} onClick={() => props.goToPage(props.currPage+1)}>Next page</a>
        <ul className="pagination-list">
            {props.currPage > 2 ?
                <li onClick={() => props.goToPage(1)}>
                    <a className="pagination-link" aria-label="Goto page 1">1</a>
                </li>
            : ""}
            {props.currPage > 3 ?
                <li>
                    <span className="pagination-ellipsis">&hellip;</span>
                </li>
            : ""}
            {props.currPage > 1 ?
                <li onClick={() => props.goToPage(props.currPage-1)}>
                    <a className="pagination-link" aria-label={"Goto page "+(props.currPage-1)}>{props.currPage-1}</a>
                </li>
            : ""}
            <li>
                <a className="pagination-link is-current" aria-label={"Page "+props.currPage} aria-current="page">{props.currPage}</a>
            </li>
            {props.currPage < props.maxPage ?
                <li onClick={() => props.goToPage(props.currPage+1)}>
                    <a className="pagination-link" aria-label={"Goto page "+(props.currPage+1)}>{props.currPage+1}</a>
                </li>
            : ""}
            {props.currPage < props.maxPage-2 ?
                <li>
                    <span className="pagination-ellipsis">&hellip;</span>
                </li>
            : ""}
            {props.currPage+1 < props.maxPage ?
                <li onClick={() => props.goToPage(props.maxPage)}>
                    <a className="pagination-link" aria-label={"Goto page "+props.maxPage}>{props.maxPage}</a>
                </li>
            : ""}
        </ul>
    </nav>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));