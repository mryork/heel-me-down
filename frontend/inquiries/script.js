let functionToReload = null;
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
            newItem: {
                name: null,
                description: null,
                department: null,
                number: null,
                price: null,
            },
            addingItem: false,
            validItem: {
                name: true,
                description: true,
                department: true,
                number: true,
                price: true,
            },
            inquiries: [],
            selectedInquiry: null,
            message: null,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

   componentWillMount() {
    if((id_token == undefined || id_token == "")) {
        if(gapi == undefined) {
            this.componentWillMount();
            console.log("OOPS")
        }
        gapi.load('auth2', function() {
            gapi.auth2.init().then(() => {
                id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
            });
          });
        
        setTimeout(() => {
            id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
            this.setState({ user: getUser()})
        }, 3000)
        
    }
    }

    componentDidMount() {
        let newState = this.state;
        newState.user = getUser();
        newState.items = getUserPosts();
        newState.allInquiries = getInquiries();
        newState.isLoaded = true;
        this.setState(newState);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        gapi.load('auth2', function() {
            gapi.auth2.init();
          });
        
        setTimeout(() => {
            id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
        }, 1000)
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
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
                sold: false,
            },
        ];
    }

    getAllInquiries() {
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
        newState.selectedInquiry = null;
        newState.inquiries = newState.allInquiries.filter(inq => {
            return inq.postName == newState.items[newState.selectedItem].name;
        });
        newState.addingItem = false;
        newState.message = null;
        this.setState(newState);
    }
    deselectItems() {
        let newState = this.state;
        newState.selectedItem = null;
        newState.selectedInquiry = null;
        newState.inquiries = [];
        newState.addingItem = false;
        newState.message = null;
        this.setState(newState);
    }
    addItem() {
        let newState = this.state;
        newState.selectedItem = null;
        newState.selectedInquiry = null;
        newState.inquiries = [];
        newState.addingItem = true;
        newState.message = null;
        this.setState(newState);
    }
    selectInquiry(inq) {
        let newState = this.state;
        newState.selectedInquiry = inq;
        newState.addingItem = false;
        newState.message = null;
        this.setState(newState);
    }
    deselectInquiries() {
        let newState = this.state;
        newState.selectedInquiry = null;
        newState.addingItem = false;
        newState.message = null;
        this.setState(newState);
    }

    messChange(str) {
        let newState = this.state;
        newState.message = str;
        this.setState(newState);
    }
    messClick() {
        let newState = this.state;
        console.log(this.state.message)
        // delete inquiry ajax
        newState.message = null;
        delete newState.inquiries[newState.selectedInquiry];
        this.setState(newState);
        console.log(this.state.inquiries)
    }

    submitItem() {

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
            setState={(state) => this.setState(state)}
            items={this.state.items}
            selectedItem={this.state.selectedItem}
            deselectItems={this.deselectItems.bind(this)}
            newItem={this.state.newItem}
            addingItem={this.state.addingItem}
            validItem={this.state.validItem}
            selectItem={this.selectItem.bind(this)}
            addItem={this.addItem.bind(this)}
            submitItem={this.submitItem.bind(this)}
            inquiries={this.state.inquiries}
            selectedInquiry={this.state.selectedInquiry}
            selectInquiry={this.selectInquiry.bind(this)}
            deselectInquiries={this.deselectInquiries.bind(this)}
            messChange={this.messChange.bind(this)}
            messClick={this.messClick.bind(this)}
            message={this.state.message}
            user={this.state.user}
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
        { props.user.name != null ?
        <div className="navbar-item">
            <div className="navbar-item">
                <h2 className="greeting">Hello, {props.user.name}</h2>
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
                            {props.user.name ? "Log Out" : "Log In"}
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


class ViewPort extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxNameLength: 20,
            maxDescLength: 300,
        }
    }
    
    itemNameChange(str) {
        let { newItem, validItem } = this.props;
        $.extend(newItem, {
            name: str,
        });
        $.extend(validItem, {
            name: str ? (str.length < this.state.maxNameLength) : null,
        });
        this.props.setState({newItem: newItem, validItem: validItem});
    }
    itemDescChange(str) {
        let { newItem, validItem } = this.props;
        $.extend(newItem, {
            description: str,
        });
        $.extend(validItem, {
            description: str ? (str.length < this.state.maxDescLength) : null,
        });
        this.props.setState({newItem: newItem, validItem: validItem});
    }
    itemDeptChange(str) {
        let { newItem, validItem } = this.props;
        $.extend(newItem, {
            department: str,
        });
        $.extend(validItem, {
            department: str ? (getDepts().filter(dept => {
                return this.toBareBones(dept.code) == this.toBareBones(str);
            }).length!=0) : null,
        });
        this.props.setState({newItem: newItem, validItem: validItem});
    }
    itemNumChange(str) {
        let { newItem, validItem } = this.props;
        $.extend(newItem, {
            number: str,
        });
        $.extend(validItem, {
            number: str.length!=0?true:null,
        });
        this.props.setState({newItem: newItem, validItem: validItem});
    }
    itemPriceChange(str) {
        let { newItem, validItem } = this.props;
        $.extend(newItem, {
            price: str,
        });
        $.extend(validItem, {
            price: str ? (!isNaN(str) && (parseFloat(str)!=NaN)) : null,
        })
        this.props.setState({newItem: newItem, validItem: validItem});
    }
    itemSubmit() {
        if (this.props.validItem) {
            this.props.submitItem();
        }
    }

    toBareBones(str) {
        if (!str) return str;
        return str.toLowerCase().replace(/ /g, '').replace(/-/g, '').replace(/_/g, '');
    }

    render() {
        const { addingItem } = this.props;
        if(!id_token) { setTimeout(() => { this.setState({ user: getUser() })}, 15000);  return(<div></div>) }
        return (
            <div className="viewport columns" style={{paddingTop: $(".navbar").css("height")}}>
                <ItemsView
                    items={this.props.items}
                    selectItem={this.props.selectItem}
                    deselectItems={this.props.deselectItems}
                    selectedItem={this.props.selectedItem}
                    addItem={this.props.addItem}
                    addingItem={this.props.addingItem}
                    user={this.props.user}
                />
                {addingItem ?
                null
                :
                <InquiriesView
                    inquiries={this.props.inquiries}
                    selectInquiry={this.props.selectInquiry}
                    deselectInquiries={this.props.deselectInquiries}
                    selectedInquiry={this.props.selectedInquiry}
                    selectedItem={this.props.selectedItem}
                />}
                {addingItem ?
                <AddItemView
                    handleNameChange={this.itemNameChange.bind(this)}
                    handleDescChange={this.itemDescChange.bind(this)}
                    handleDeptChange={this.itemDeptChange.bind(this)}
                    handleNumChange={this.itemNumChange.bind(this)}
                    handlePriceChange={this.itemPriceChange.bind(this)}
                    handleClick={this.itemSubmit.bind(this)}
                    newItem={this.props.newItem}
                    validName={this.props.validItem.name}
                    validDesc={this.props.validItem.description}
                    validDept={this.props.validItem.department}
                    validNum={this.props.validItem.number}
                    validPrice={this.props.validItem.price}
                />
                :
                <MessageView
                    inquiry={this.props.selectedInquiry!=null ? this.props.inquiries[this.props.selectedInquiry] : null}
                    messChange={this.props.messChange}
                    messClick={this.props.messClick}
                    message={this.props.message}
                />
                }
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
            <div
                className={"viewBlock itemBlock is-new".concat(this.props.addingItem?" is-selected":"").concat(!this.props.userLoggedIn?" is-disabled":"")}
                onClick={(e) => {e.stopPropagation(); this.props.userLoggedIn?this.props.addItem():null}}>
                    <p className="subtitle is-4">New Post <span className="icon"><i className="fas fa-plus"></i></span></p>
            </div>
        );
    }

    renderItemBlock(item, key) {
        console.log(Object.entries(this.props.user).length!=0)
        return (
        <ItemBlock
            id={item.id}
            name={item.name}
            keyprop={key}
            handleClick={this.props.selectItem}
            selected={this.props.selectedItem == key}
            userLoggedIn={Object.entries(this.props.user).length!=0}
            key={key}
        />
        );
    }

    render() {
        return (
        <div className="column is-2 itemsView" onClick={() => this.props.deselectItems()}>
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
    <div
        className={"viewBlock itemBlock is-".concat(props.keyprop%2==0?"even":"odd").concat(props.selected?" is-selected":"")}
        onClick={(e) => {e.stopPropagation(); props.handleClick(props.keyprop)}}>
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
                selected={this.props.selectedInquiry == key}
                key={key}
            />
        )
    }

    render() {
        return (
            <div className="column is-2 inquiriesView" onClick={() => this.props.deselectInquiries()}>
                {this.props.inquiries.length!=0 ?
                this.props.inquiries.map((inq, key) =>
                    this.renderInquiryBlock(inq, key)
                )
                :
                (this.props.selectedItem ?
                <div className="container blankInq">
                    <div className="content">
                        <p className="title is-5">No inquiries</p>
                        <p className="title is-5">found</p>
                    </div>
                </div>
                :
                <div className="container blankInq">
                    <div className="content">
                        <p className="title is-5">No item</p>
                        <p className="title is-5">selected</p>
                    </div>
                </div>
                )}
            </div>
        );
    }
}

function InquiryBlock(props) {
    return (
        <div
            className={"viewBlock inquiryBlock is-".concat(props.keyprop%2==0?"even":"odd").concat(props.selected?" is-selected":"")}
            onClick={(e) => {e.stopPropagation(); props.handleClick(props.keyprop)}}>
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
        <div className="column is-8 messageView">
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
                {/* <div className="field">
                    <label className="label">Reply</label>
                    <div className="control">
                        <textarea
                            className="textarea has-fixed-size"
                            placeholder="e.g. Here's my email: example@example.com"
                            rows="3"
                            onChange={(e) => props.messChange($(e.target).val())}
                            value={props.message?props.message:""}
                        />
                    </div>
                </div>
                <div className="columns msgLabel-Button">
                    <div className="column is-10">
                        <label className="label">This inquiry will be deleted upon sending message</label>
                    </div>
                    <div className="column is-2">
                        <div className="field">
                            <div className="buttons is-right">
                                <button
                                    className="button"
                                    disabled={!(props.message && props.message.length!=0)}
                                    onClick={() => props.messClick()}>
                                        Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div> */}
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

function AddItemView(props) {
    const { validName, validDesc, validDept, validNum, validPrice, newItem } = props;
    let goodToGo = ((validName && validDesc && validDept && validNum && validPrice) && 
                    (newItem.name && newItem.description && newItem.department && newItem.number && newItem.price));
    return (
        <div className="column is-10 addItemView">
            <h1 className="title is-2">Create Post</h1>
            <div className="field">
                <label className="label">Item Name</label>
                <div className="control">
                    <input
                        className={"input ".concat(validName?"":(validName==false?"is-danger":"is-warning"))}
                        type="text"
                        placeholder="e.g. ENGL 105 Workbook"
                        onChange={(e) => props.handleNameChange($(e.target).val())}
                    />
                </div>
            </div>
            <div className="field">
                <label className="label">Description</label>
                <textarea
                    className={"textarea has-fixed-size ".concat(validDesc?"":(validName==false?"is-danger":"is-warning"))}
                    placeholder="e.g. Barely used, no pages missing or written on"
                    onChange={(e) => props.handleDescChange($(e.target).val())}
                />
            </div>
            <div className="columns dept-num">
                <div className="column is-4 field">
                    <label className="label">Department</label>
                    <div className="control">
                        <input
                            className={"input ".concat(validDept?"":(validDept==false?"is-danger":"is-warning"))}
                            type="text"
                            placeholder="e.g. ENGL"
                            onChange={(e) => props.handleDeptChange($(e.target).val())}
                        />
                    </div>
                </div>
                <div className="column is-1"></div>
                <div className="column is-4 field">
                    <label className="label">Number</label>
                    <div className="control">
                        <input
                            className={"input ".concat(validNum?"":(validNum==false?"is-danger":"is-warning"))}
                            type="text"
                            placeholder="e.g. 105"
                            onChange={(e) => props.handleNumChange($(e.target).val())}
                        />
                    </div>
                </div>
            </div>
            <div className="field">
                <label className="label">Price</label>
                <div className="control">
                    <input
                        className={"input ".concat(validPrice?"":(validPrice==false?"is-danger":"is-warning"))}
                        type="text"
                        placeholder="e.g. any whole or decimal number"
                        onChange={(e) => props.handlePriceChange($(e.target).val())}
                    />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button
                        className="button"
                        disabled={!(goodToGo)}
                        onClick={(e) => props.handleClick($(e.target).val())}>
                            Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

function renderSite() {
    ReactDOM.render(<App />, document.getElementById("root"));
}

function check() {
if(id_token) {
    renderSite()
} else {
    gapi.load('auth2', function() {
        gapi.auth2.init().then(() => {
            id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
        });
      });
    setTimeout(() => { if(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token) { id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; } check() },500 )
}
}

check()