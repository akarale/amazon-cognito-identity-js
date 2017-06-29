import React from "react";
import ReactDOM from "react-dom";
import Script from 'react-load-script';

import appConfig from "./config.js";

export default class PlaidForm extends React.Component{
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(){
    return false;
  }

  handleScriptCreate() {
    console.log("Script created..");

  // this.setState({ scriptLoaded: false })
}

handleScriptError() {
  console.log("Problem with Plaid...");
  // this.setState({ scriptError: true })
}

handleScriptLoad() {
  console.log("Loading Plaid...");
  // this.setState({ scriptLoaded: true })
}

startPlaid(e){
  var lh = Plaid.create({
   env: 'sandbox',
   clientName: 'Plaid Sandbox',
   // Replace '<PUBLIC_KEY>' with your own `public_key`
   key: appConfig.PlaidKey,
   product: ['transactions'],
   onSuccess: function(public_token, metadata) {
     console.log(public_token);
     // Send the public_token to your app server here.
     // The metadata object contains info about the
     // institution the user selected and the
     // account_id, if selectAccount is enabled.
   },
   onExit: function(err, metadata) {
     // The user exited the Link flow.
     if (err != null) {
       // The user encountered a Plaid API error
       // prior to exiting.
     }
     // metadata contains information about the
     // institution that the user selected and the
     // most recent API request IDs. Storing this
     // information can be helpful for support.
   }
 });
 lh.open();
}

  render(){
    return(
      <div>
        <h1>PLAID Component</h1>
        <Script
      url="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
      onCreate={this.handleScriptCreate.bind(this)}
      onError={this.handleScriptError.bind(this)}
      onLoad={this.handleScriptLoad.bind(this)}
      />
    <button onClick={this.startPlaid.bind(this)}>START PLAID</button>
      </div>
      )
  }
}
