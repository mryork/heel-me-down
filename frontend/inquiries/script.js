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
            items: [],
            selectedItem: null,
            inquiries: [],
            selectedInquiry: null,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        let newState = this.state;
        newState.user = this.getUser();
        newState.items = this.getItems();
        newState.inquiries = this.getInquiries();
        newState.isLoaded = true;
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

    getItems() {
        return [
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
        ];
    }

    getInquiries() {
        return [
            {
                id: 1,
                postName: "textbook1",
                fromUser: "Bob",
                phoneNumber: null,
                email: null,
                message: "gimme tit",
                date: Date.UTC(2011, 6, 9, 0, 0, 0),
            },
            {
                id: 4,
                postName: "textbook1",
                fromUser: "Bobby",
                phoneNumber: "828-828-8288",
                email: "null@null.com",
                message: "give ya a nickel for it",
                date: Date.UTC(2019, 6, 9, 0, 0, 0),
            },
            {
                id: 16,
                postName: "textbook1",
                fromUser: "Barbara",
                phoneNumber: "999-690-4200",
                email: null,
                message: "I would like to purchase this item.",
                date: Date.UTC(2019, 11, 10, 0, 0, 0),
            },
            {
                id: 64,
                postName: "textbook1",
                fromUser: "Billiam",
                phoneNumber: null,
                email: "dicklover69@bellsouth.net",
                message: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
                date: Date.UTC(2019, 10, 29, 0, 0, 0),
            },
        ]
    }

    loadSearchResults(str) {
        window.location.href = "../search-results?s=".concat(str);
    }

    selectItem(item) {
        let newState = this.state;
        newState.selectedItem = item;
        this.setState(newState);
    }

    selectInquiry(inq) {
        let newState = this.state;
        newState.selectedInquiry = inq;
        this.setState(newState);
    }

    render() {
        const { isLoaded, user } = this.state;

        return (
        <div id="innerRoot">
        <Navbar
            setState={(state) => this.setState(state)}
            inquiries={() => {}}
            toggleLog={() => {}}
            loadSearchResults={this.loadSearchResults.bind(this)}
            user={isLoaded ? user : {id: "Loading..."}}
            suggestions={this.state.suggestions}
            searchStr={this.state.searchStr}
            searchSel={this.state.searchSel}
            navInput={this.state.navInput}
            devWidth={this.state.width}
            inputActive={this.state.inputActive}
            optionsActive={this.state.optionsActive}
            burgerActive={this.state.burgerActive}
        />
        <ViewPort
            items={this.state.items}
            selectedItem={this.state.selectedItem}
            selectItem={this.selectItem.bind(this)}
            inquiries={this.state.inquiries}
            selectedInquiry={this.state.selectedInquiry}
            selectInquiry={this.selectInquiry.bind(this)}
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
        let bareSearchStr = this.toBareBones(searchStr);
        if (searchSel != null) {
            this.searchChange(suggestions[searchSel]);
            searchSel = null;
        } else if (bareSearchStr.length > 4 && suggestions.length > 1) {
            $(navInput).blur();
            console.log("getItems", searchStr, suggestions.length)
            this.props.setState({
                searchSel: searchSel,
            });
            this.props.loadSearchResults(bareSearchStr);
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
            if (searchSel == null && suggestions.length > 1) searchSel = 1;
            else if (searchSel == null) searchSel = 0;
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
                            Posts/Inquiries
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

class ViewPort extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="viewport columns" style={{paddingTop: $(".navbar").css("height")}}>
                <div className="column is-2">
                <ItemsView
                    items={this.props.items}
                    selectItem={this.props.selectItem}
                />
                </div>
                <div className="column is-2">
                <InquiriesView
                    inquiries={this.props.inquiries}
                    selectInquiry={this.props.selectInquiry}
                />
                </div>
                <div className="column is-8 msgCol">
                <MessageView
                    inquiry={this.props.selectedInquiry!=null ? this.props.inquiries[this.props.selectedInquiry] : null}
                />
                </div>
            </div>
        );
    }
}

class ItemsView extends React.Component {
    constructor(props) {
        super(props);
    }

    renderNewItemBlock() {
        return (
            <div className="itemBlock is-new" onClick={() => this.props.addItem()}>
                <p className="subtitle is-4">New Post</p>
            </div>
        );
    }

    renderItemBlock(item, key) {
        return (
        <ItemBlock
            id={item.id}
            name={item.name}
            keyprop={key}
            handleClick={this.props.selectItem}
            key={key}
        />
        );
    }

    render() {
        return (
        <div className="itemsView">
            {this.renderNewItemBlock()}
            {this.props.items.map((item, key) =>
                this.renderItemBlock(item, key)
            )}
        </div>
        );
    }
}

function ItemBlock(props) {
    return (
    <div className={"itemBlock is-".concat(props.keyprop%2==0?"even":"odd")} onClick={() => props.handleClick(props.keyprop)}>
        <p className="subtitle is-4">{props.name}</p>
    </div>
    );
}

class InquiriesView extends React.Component {
    constructor(props){
        super(props);
    }

    renderInquiryBlock(inq, key) {
        return (
            <InquiryBlock
                id={inq.id}
                fromUser={inq.fromUser}
                keyprop={key}
                handleClick={this.props.selectInquiry}
                key={key}
            />
        )
    }

    render() {
        return (
            <div className="inquiriesView">
                {this.props.inquiries.map((inq, key) =>
                    this.renderInquiryBlock(inq, key)
                )}
            </div>
        );
    }
}

function InquiryBlock(props) {
    return (
        <div className={"inquiryBlock is-".concat(props.keyprop%2==0?"even":"odd")} onClick={() => props.handleClick(props.keyprop)}>
            <p className="subtitle is-4">{props.fromUser}</p>
        </div>
    );
}

function MessageView(props) {
    let { inquiry } = props;
    let timePassed, postDate;

    if (inquiry) {
        timePassed = Date.now()-inquiry.date;
        timePassed = { years: Math.floor(timePassed/(1000*60*60*24*365)), days: Math.floor(timePassed/(1000*60*60*24)) }
        postDate = "";
        postDate = postDate.concat((timePassed.years > 0) ? `${timePassed.years} year${timePassed.years==1?'':'s'} ` : '');
        postDate = postDate.concat((timePassed.days > 0 && timePassed.days%365!=0) ? `${timePassed.days-timePassed.years*365} day${timePassed.days%365==1?'':'s'}` : '');
        if (postDate.length == 0) postDate = postDate.concat("today")
        else postDate = postDate.concat(" ago")
        postDate = "Sent ".concat(postDate);
    }

    return (
        <div className="messageView">
            {inquiry ?
            <div className="displayMsg">
                <h1 className="title is-3">{inquiry.postName}</h1>
                <div className="from-date">
                    <h3 className="title is-4">From: {inquiry.fromUser}</h3>
                    <h3 className="subtitle is-4">{postDate}</h3>
                </div>
                <h2 className="title is-5">Phone: {inquiry.phoneNumber ? inquiry.phoneNumber : "N/A"}</h2>
                <h2 className="title is-5">Email: {inquiry.email ? inquiry.email : "N/A"}</h2>
                <h4 className="subtitle is-5 msg">{inquiry.message}</h4>
            </div>
            :
            <div className="blankMsg">
                <div className="columns is-centered is-vcentered">
                    <img src="../imgs/logo-large.png" />
                </div>
                <br />
                <div className="columns is-centered is-vcentered">
                    <h2 className="subtitle is-4">Try selecting an item and inquiry to see the message here.</h2>
                </div>
                <br /><br />
            </div>}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));