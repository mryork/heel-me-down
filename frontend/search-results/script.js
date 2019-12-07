class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                isLoggedIn: true,
                id: 42069,
            },
            currPage: 2,
            maxPage: 10,
            items: [
                {
                    itemId: 1,
                    description: "hair",
                    materials: [
                        "red",
                        "green",
                        "blue",
                    ],
                },
                {
                    itemId: 5,
                    description: "book",
                    materials: [
                        "mean",
                        "naughty",
                        "wicked",
                    ],
                },
            ],
        };
    };

    selectItem(item) {

    }

    goToPage(page) {
        let newState = this.state;
        if (page > 0 && page <= newState.maxPage) {
            newState.currPage = page;
        }
        this.setState(newState);
    }

    render() {
        return (
        <div>
        <Navbar
            user={this.state.user}
            settings={() => {}}
            inquiries={() => {}}
            toggleLog={() => {}}
        />
        <div id="itemCount" className="columns is-centered">
            <div className="column is-two-thirds">
                <p>Your search yielded 11 results.</p>
            </div>
        </div>
        <ListView
            items={this.state.items}
            selectItem={this.selectItem.bind(this)}
        />
        <Pagination
            currPage={this.state.currPage}
            maxPage={this.state.maxPage}
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

    render() {
        return (
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
            <NavbarBrand />
            <NavbarMenu />
            <NavbarEnd
                user={this.props.user}
                inquiries={this.props.inquiries}
                settings={this.props.settings}
                toggleLog={this.props.toggleLog}
            />
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
        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false"
            data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>
    );
}

function NavbarMenu(props) {
    return (
    <div className="navbar-menu">
        <div className="navbar-start">
            <div className="navbar-item">
                <div className="control has-icons-left">
                    <input className="input is-small is-rounded" placeholder="e.g. ENGL 105L" />
                    <span className="icon is-left">
                        <i className="fas fa-search"></i>
                    </span>
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
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                    <h2>Hello, {props.user.id}</h2>
                    <h3>Options</h3>
                </a>
                <div className="navbar-dropdown is-right">
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
                itemId={item.itemId}
                description={item.description}
                materials={item.materials}
                handleClick={this.props.selectItem}
                key={key}
            />
        );
    }

    render() {
        return (
        <div>
            {this.props.items.map((item, key) => this.renderItem(item, key))}
        </div>
        );
    }
}

function ListItem(props) {
    return (
    <div className="columns is-centered">
        <div className="column listing is-two-thirds" onClick={() => props.handleClick(props.itemId)}>
            <h1>{props.itemId}</h1>
            <h2>{props.description}</h2>
            {props.materials.map((mat, key) => {
                return <p key={key}>{mat}</p>
            })}
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