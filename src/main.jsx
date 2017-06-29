import {Config, CognitoIdentityCredentials} from "aws-sdk";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser

} from "amazon-cognito-identity-js";
import React from "react";
import ReactDOM from "react-dom";
import appConfig from "./config";
import axios from 'axios';
import SignUpForm from './SignUpForm.jsx';
import LoginForm from './LoginForm.jsx';
import PlaidForm from './PlaidForm.jsx';
import InvoiceFileAdder from './InvoiceFileAdder.jsx';
import {tokenFunc} from './tokenFunc.jsx'

// Config.region = appConfig.region;
// Config.credentials = new CognitoIdentityCredentials({
//   IdentityPoolId: appConfig.IdentityPoolId
// });

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});


class AllForms extends React.Component{
  render(){
    return(
      <div>
        <InvoiceFileAdder/>
        <PlaidForm/>
        <SignUpForm/>
        <LoginForm/>
        <AxiosCalls/>
      </div>
      )
  }
}


class AxiosCalls extends React.Component{

  get_data(){
    axios.get('https://y50jdj13mi.execute-api.us-east-2.amazonaws.com/prod/lambdatest',
    {
    params: {
      "username": "neoabhi107"
    },
    headers:{
      'Authorization': tokenFunc(),
      'Content-Type': 'application/json'
    }
    })
    .then(function (response) {
      console.log(response.data)
      console.log("Data get successfully")
    })
    .catch(function (error) {
      console.log(error)
      console.log("Data not get successfully")
    });

  }

  //example of posting data to AWS API Gateway using axios.
  post_data(){
    var authenticationData = {
        Username : 'somepop@gmail.com',
        Password : 'password',
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var poolData = { UserPoolId : 'us-east-2_T0gkgzxsf',
        ClientId : '5j49ebj30qngadhvrgbhvfv4lu'
    };
    var userPool = new CognitoUserPool(poolData);
    var userData = {
        Username : 'somepop@gmail.com',
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
            // axios.get('https://y50jdj13mi.execute-api.us-east-2.amazonaws.com/prod/lambdatest',{})
            // .then(function(res){
            //   console.log(res)
            // })
            // .catch(function(err){
            //   console.log(err)
            // });
            axios.post('https://y50jdj13mi.execute-api.us-east-2.amazonaws.com/prod/lambdatest',
              {
            "type": "cat",
            "price": 149.99
              },
            {
            headers:{
              'Authorization': result.getIdToken().getJwtToken(),
              'Content-Type': 'application/json'
            }
            })
            .then(function (response) {
              console.log(response.data)
              console.log("Data posted successfully")
            })
            .catch(function (error) {
              console.log(error)
              console.log("Data not posted successfully")
            });
        },
        onFailure: function(err) {
            alert(err);
        }
    });
  }

  render(){
    return(
      <div>
      <h1>Axios Call</h1>
      <button onClick={this.post_data.bind(this)}>Post Data</button>
      <button onClick={this.get_data.bind(this)}>Get Data</button>
      </div>
      )
  }
}



ReactDOM.render(<AllForms />, document.getElementById('app'));
