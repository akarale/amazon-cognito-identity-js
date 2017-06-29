import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser

} from "amazon-cognito-identity-js";
import React from "react";
import appConfig from "./config";

export default class LoginForm extends React.Component{
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
    //Sets username and password to use for auth
    var authenticationData = {
        Username : this.state.email,
        Password : this.state.password,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId : appConfig.UserPoolId,
        ClientId : appConfig.ClientId
    };
    var userPool = new CognitoUserPool(poolData);
    var userData = {
        Username : this.state.email,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);

    //Function authenticates user. If authenticated, the token is saved in localStorage.
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // console.log('access token: ' + result.getAccessToken().getJwtToken());
            /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
            // console.log('idToken + ' + result.idToken.jwtToken);
            console.log("Authenticated")
            localStorage.setItem("ariumAuthToken", result.getAccessToken().getJwtToken())

        },
        onFailure: function(err) {
          // console.log(authenticationData);
          console.log(err)
          console.log("Unable to authenticate.")
            // console.log(err);
        },

    });
  }

  superfoo(e){
    var res =  this.isLoggedIn();
    console.log(res)
  }

  isLoggedInPromise(){
        var data = {
          UserPoolId : appConfig.UserPoolId,
          ClientId : appConfig.ClientId
       };
       var userPool = new CognitoUserPool(data);
       var cognitoUser = userPool.getCurrentUser();
       return new Promise(function(resolve,reject){
         if(cognitoUser==null) reject(err);
         cognitoUser.getSession(function(err, session) {
           if(err!==null) return reject(err);
           resolve(session);
         });
       });
  }

  isLoggedIn(){
    return this.isLoggedInPromise()
    .then(function(data){
      console.log("TRUE")
      return true;
    })
    .catch(function(err){
      return false;
    });
 }

  render(){
    return(
      <div>
        <h1>Log in</h1>
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

      )
  }
}
