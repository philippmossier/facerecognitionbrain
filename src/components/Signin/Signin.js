import React, { Component } from 'react'; // Smart Components/ClassComponents always need to import {Component} otherwise you need to declare the class like this : class Signin extends React.Component { ...

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: "",
            signPassword: ""
        }
    }

    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ signPassword: event.target.value })
    }

    onSubmitSignIn = () => {
        //need to pass an object in second fetch parameter to describe what kind of request ( get,post,put ...)
        fetch("https://polite-eds-79454.herokuapp.com/signin", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({    // Backend dont understand a JS Object so you need to convert the JS Object to JSON Format
                email: this.state.signInEmail,
                password: this.state.signPassword
            })
        })
            .then(response => response.json()) //When user email and pw is correct navigate to home screen
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange("home");
                }
            })
    }

    render() {
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                                    Email
							</label>
                                <input
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">
                                    Password
							</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={this.onSubmitSignIn}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Sign in"
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange("register")} href="#0" className="f6 link dim black db pointer">
                                Register
						</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;


