class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogin: true,
            invalid: false,
        };
    }

    setLogin() {
        let newState = this.state;
        newState.isLogin = true;
        this.setState(newState);
    }

    setRegister() {
        let newState = this.state;
        newState.isLogin = false;
        this.setState(newState);
    }

    handleClick() {
    }

    render() {
        return (
        <div className="columns is-centered is-vcentered">
            <div className="column is-half">
                <div className="card">
                    <div className="card-content">
                        <a href="../index.html">
                            <img src="../imgs/logo-gray.png" />
                        </a>
                        <div className="tabs is-centered is-medium is-boxed is-fullwidth">
                            <ul>
                                <li className={this.state.isLogin?"is-active":""} onClick={() => this.setLogin()}><a>Log In</a></li>
                                <li className={!this.state.isLogin?"is-active":""} onClick={() => this.setRegister()}><a>Register</a></li>
                            </ul>
                        </div>
                        <div className="field">
                            <label className="label">UNC Email</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="onyen@live.unc.edu" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input className="input" type="password" placeholder="password1234" />
                            </div>
                        </div>
                        <p>{this.state.invalid?"This email and password combination was not found.":""}</p>
                        <button className="button" onClick={() => this.handleClick()}>Log In</button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));