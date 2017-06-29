import React from "react";
import Dropzone from "react-dropzone"
import axios from "axios"
import {tokenFunc} from './tokenFunc.jsx'

export default class InvoiceFileAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      username: 'neoabhi98',
      customername: 'google',
      creationdate: '06-15-17'
    };
  }

  onDrop(files) {
    this.setState({file: files[0]})
    console.log("File saved to state")
  }

  handleSubmit(){
    var file = this.state.file
    var filename = this.state.username+"_"+this.state.customername+"_"+this.state.creationdate+"_"+file.name;
    var filetype = file.type;
    axios.get("https://y50jdj13mi.execute-api.us-east-2.amazonaws.com/prod/s3access",
    {
      params:{
      "filename": filename,
      "filetype": filetype
      },
      headers:{
        'Authorization': tokenFunc(),
        'Content-Type': 'application/json'
      }
    })
    .then(function (result) {
      var signedUrl = result.data
      var options = {
        headers: {
          'Content-Type': filetype
        }
      };
      axios.put(signedUrl, file, options);
      console.log("Invoice file added.")
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  render() {
    const dropzoneStyle = {
      width  : "100%",
      height : "20%",
      border : "1px solid black"
  };
    return (
      <div>
      <Dropzone onDrop={this.onDrop.bind(this)} style={dropzoneStyle}>
        <div>
          Drop some files here!
        </div>
      </Dropzone>
      <button onClick={this.handleSubmit.bind(this)}>SUBMIT FILE</button>
      </div>
    );
  }
}
