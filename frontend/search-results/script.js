class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                isLoggedIn: true,
                id: 42069,
            }
        }
    };

    render() {
        return (
        <Navbar
            user={this.state.user}
            settings={() => {}}
            inquiries={() => {}}
            toggleLog={() => {}}
        />
        );
    }
}

class Navbar extends React.Component {
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

ReactDOM.render(<App />, document.getElementById("root"));