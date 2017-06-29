/******************** Authenticated User Logic ************************/
import {
  CognitoUserPool,
  CognitoUserAttribute,

} from "amazon-cognito-identity-js";
import appConfig from "./config.js";

export function tokenFunc() {
  let data = {
          token: "",
          UserPoolId : appConfig.UserPoolId,
          ClientId : appConfig.ClientId
       };
  var userPool = new CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
       cognitoUser.getSession(function(err, session) {
           if (err) {
             //USER NOT LOGGED IN HERE

           }
           else{
               //USER LOGGED IN HERE
              data.token = session.getIdToken().getJwtToken()
         }
       });
     }
     //USER NOT LOGGED IN HERE
     return data.token;
}
