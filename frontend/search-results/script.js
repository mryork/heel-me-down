class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: null,
            height: null,
            isLoaded: false,
            user: {},
            currPage: 1,
            itemsPerPage: 20,
            items: [],
            searchStr: "",
            searchSel: null,
            suggestions: [],
            inputActive: false,
            burgerActive: false,
            optionsActive: false,
            selectedItem: null,
            message: "",
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    };

    componentDidMount() {
        let newState = this.state;
        newState.user = this.getUser();
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            newState.searchStr = value.slice(0, value.search(/\d/)).toUpperCase().concat(' '+value.slice(value.search(/\d/)));
        });
        console.log(newState.searchStr)
        this.setState(newState);
        let [dept, num] = newState.searchStr.split(' ');
        this.getItems(dept, num);
        this.updateWindowDimensions();
        
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    deselectItems() {
        let { items } = this.state;
        items.map(item => {
            let newItem = item;
            newItem.selected = false;
            item = newItem;
        });
        this.setState({items: items, selectedItem: null});
    }

    getUser() {
        return {
            isLoggedIn: true,
            id: 42069,
            searchStr: "AMST 125",
        };
    }

    getItems(dept, num) {
        this.setState({isLoaded: false});
        // ajax
        console.log(dept, num)
        this.setState({
            isLoaded: true,
            items: [
            {
                id: 1,
                department: "AMST",
                number: "125",
                name: "textbook1",
                seller: "Adam Cogdell",
                date: Date.UTC(2018, 11, 9, 0, 0, 0),
                description: "book with book features",
                price: 10.99,
                amazonPrice: 11.99,
                sold: false,
            },
            {
                id: 6,
                department: "BIO",
                number: "101",
                name: "iclicker",
                seller: "Matthew Ardizzone",
                date: Date.UTC(2019, 11, 9, 0, 0, 0),
                description: "clikn.space",
                price: 10000000.01,
                amazonPrice: 0.92,
                sold: true,
            },
            {
                id: 5,
                department: "COMP",
                number: "999",
                name: "boat",
                seller: "Joshua Cogdell",
                date: Date.UTC(2019, 11, 8, 0, 0, 0),
                description: "floats well",
                price: 1.75,
                amazonPrice: 2.25,
                sold: false,
            },
            {
                id: 10,
                department: "PHIL",
                number: "224H",
                name: "air",
                seller: "Jesus Christ",
                date: Date.UTC(2018, 11, 7, 0, 0, 0),
                description: "this shits wet yeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                price: 0,
                amazonPrice: 1.11,
                sold: true,
            },
            {
                id: 65,
                department: "ENGL",
                number: "105i",
                name: "laptop",
                seller: "Ann Bee",
                date: Date.UTC(2019, 2, 10, 0, 0, 0),
                description: "core i11 9999k, rtx 4090ti, 256gb ram, 32tb m.2 ssd, 8k 3000hz panel",
                price: 120.2,
                amazonPrice: 100000000000020.2,
                sold: false,
            },
        ]});
    }

    messClick() {
        // sendMessage() ajax
    }

    render() {
        const { isLoaded, user, items, currPage, itemsPerPage } = this.state;
        return (
        <div id="innerRoot">
        <Navbar
            setState={(state) => this.setState(state)}
            getItems={(dept, num) => this.getItems(dept, num)}
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
        <ListView
            setState={(state) => this.setState(state)}
            deselectItems={this.deselectItems.bind(this)}
            messClick={this.messClick.bind(this)}
            items={isLoaded ? items : []}
            currPage={currPage}
            itemsPerPage={itemsPerPage}
            totalItems={isLoaded ? items.length : 0}
        />
        <Pagination
            setState={(state) => this.setState(state)}
            deselectItems={this.deselectItems.bind(this)}
            currPage={currPage}
            maxPage={isLoaded ? Math.ceil(items.length/itemsPerPage) : currPage}
        />
        </div>
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
        <nav className="navbar" role="navigation" aria-label="main navigation">
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
        { props.user.isLoggedIn ?
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
                            Posts/Inquiries
                    </a>
                    <hr className="navbar-divider" />
                    <a
                        className="navbar-item"
                        href="../index.html"
                        onClick={signOut}>
                            {props.user ? "Log Out" : "Log In"}
                    </a>
                    </div>
                    :null}
                </div>
            </div>
            </div>
            : <div className="navbar-item"><a className="button is-primary" href="/index.html">Sign-In on Homepage</a></div>}
        </div>
    );
}

class ListView extends React.Component {
    constructor(props) {
        super(props);
    }

    selectItem(itemId, e) {
        e.stopPropagation();
        let { items, selectedItem } = this.props;
        items.map((item, i) => {
            let newItem = item;
            newItem.selected = (item.id==itemId);
            selectedItem = newItem.selected ? i : selectedItem;
            item = newItem;
        });
        this.props.setState({items: items, selectedItem: selectedItem});
    }

    renderItem(item, key) {
        return (
            <ListItem
                selectItem={this.selectItem.bind(this)}
                messChange={(str) => this.props.setState({message: str})}
                messClick={this.props.messClick}
                id={item.id}
                itemName={item.name}
                sellerName={item.seller}
                postDate={item.date}
                description={item.description}
                isSelected={item.selected}
                price={item.price}
                months={this.props.months}
                key={key}
            />
        );
    }

    render() {
        let { items, totalItems, currPage, itemsPerPage } = this.props;
        items = items.slice((currPage-1)*itemsPerPage, currPage*itemsPerPage);
        return (
        <div className="listView" onClick={() => this.props.deselectItems()}>
            <div id="itemCount" className="columns is-centered">
                <div className="column is-two-thirds">
                    {totalItems!=-1 ? <p>Your search yielded {totalItems} results.</p> : <p>Loading...</p>}
                </div>
            </div>
            {items.map((item, key) => this.renderItem(item, key))}
            {totalItems==0 ?
            <div id="blankPage">
            <div className="columns is-centered is-vcentered">
                <img src="../imgs/logo-large.png" />
            </div>
            <div className="columns is-centered is-vcentered">
                <h2 className="subtitle is-4">Sorry about that. Try searching for a different course.</h2>
            </div>
            </div>
            :null}
        </div>
        );
    }
}

function ListItem(props) {
    let timePassed = Date.now()-props.postDate;
    timePassed = { years: Math.floor(timePassed/(1000*60*60*24*365)), days: Math.floor(timePassed/(1000*60*60*24)) }
    let postDate = "";
    postDate = postDate.concat((timePassed.years > 0) ? `${timePassed.years} year${timePassed.years==1?'':'s'} ` : '');
    postDate = postDate.concat((timePassed.days > 0 && timePassed.days%365!=0) ? `${timePassed.days-timePassed.years*365} day${timePassed.days%365==1?'':'s'}` : '');
    if (postDate.length == 0) postDate = postDate.concat("today")
    else postDate = postDate.concat(" ago")
    postDate = "Posted ".concat(postDate);

    return (
    <div className={"columns is-centered ".concat(props.isSelected?"selected":"")}>
        <div className={"column listing is-".concat(props.isSelected?"8":"8")} onClick={(e) => props.selectItem(props.id, e)}>
            <div className="columns is-centered">
                <div className="column is-2 itemImg">
                    <img src="../imgs/ex_user_icon.png" />
                </div>
                <div className={"column itemInfo is-".concat(props.isSelected?"10":"10")}>
                    <div className="name-date">
                        <h1 className="title is-3">{props.itemName}</h1>
                        <p className="subtitle is-6">{postDate}</p>
                    </div>
                    <div className="seller-price">
                        <p className="title is-5">{props.sellerName}</p>
                        <p className="title is-6">${props.price}</p>
                    </div>
                    <div className="desc">{props.description}</div>
                </div>
            </div>
            {props.isSelected ? 
            <div className="columns is-centered buyItem">
                <div className="column is-12">
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
            </div>
            :null}
        </div>
    </div>
    );
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }

    goToPage(page) {
        let { currPage, maxPage } = this.props;
        if (page > 0 && page <= maxPage) {
            currPage = page;
        }
        this.props.setState({currPage: currPage});
    }

    render() {
        const { currPage, maxPage } = this.props;

        return (
        <nav className="pagination is-dark" role="navigation" aria-label="pagination" onClick={() => this.props.deselectItems()}>
            <a className="pagination-previous" disabled={currPage == 1} onClick={() => this.goToPage(currPage-1)}>Previous</a>
            <a className="pagination-next" disabled={currPage == maxPage} onClick={() => this.goToPage(currPage+1)}>Next page</a>
            <ul className="pagination-list">
                {currPage > 2 ?
                    <li onClick={() => this.goToPage(1)}>
                        <a className="pagination-link" aria-label="Goto page 1">1</a>
                    </li>
                : ""}
                {currPage > 3 ?
                    <li>
                        <span className="pagination-ellipsis">&hellip;</span>
                    </li>
                : ""}
                {currPage > 1 ?
                    <li onClick={() => this.goToPage(currPage-1)}>
                        <a className="pagination-link" aria-label={"Goto page "+(currPage-1)}>{currPage-1}</a>
                    </li>
                : ""}
                <li>
                    <a className="pagination-link is-current" aria-label={"Page "+currPage} aria-current="page">{currPage}</a>
                </li>
                {currPage < maxPage ?
                    <li onClick={() => this.goToPage(currPage+1)}>
                        <a className="pagination-link" aria-label={"Goto page "+(currPage+1)}>{currPage+1}</a>
                    </li>
                : ""}
                {currPage < maxPage-2 ?
                    <li>
                        <span className="pagination-ellipsis">&hellip;</span>
                    </li>
                : ""}
                {currPage+1 < maxPage ?
                    <li onClick={() => this.goToPage(maxPage)}>
                        <a className="pagination-link" aria-label={"Goto page "+maxPage}>{maxPage}</a>
                    </li>
                : ""}
            </ul>
        </nav>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));