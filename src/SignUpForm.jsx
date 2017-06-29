import {
  CognitoUserPool,
  CognitoUserAttribute,

} from "amazon-cognito-identity-js";
import React from "react";
import appConfig from "./config";

export default class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const attributeList = [
      new CognitoUserAttribute(
      {//adding email attribute
        Name: 'email',
        Value: email,
      }
    )
    ];

    var poolData = {
        UserPoolId : appConfig.UserPoolId,
        ClientId : appConfig.ClientId
    };
    var userPool = new CognitoUserPool(poolData);

    //in this case, username is also the email attribute. A pre-sign up Lambda trigger is called to autoConfirm the user.
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log('user not signed up.')
        // console.log(err);
        return;
      }
      console.log('user signed up.')
      // console.log('user name is ' + result.user.getUsername());
      // console.log('call result: ' + JSON.stringify(result));
    });
  }

  render() {
    return (
      <div>
      <h1>Sign Up</h1>
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text"
               value={this.state.email}
               placeholder="Email"
               onChange={this.handleEmailChange.bind(this)}/>
        <input type="password"
               value={this.state.password}
               placeholder="Password"
               onChange={this.handlePasswordChange.bind(this)}/>
        <input type="submit"/>
      </form>
      </div>
    );
  }
}
