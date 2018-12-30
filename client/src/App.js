import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080/')

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      songToAdd: ''
    };
    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.initSocket();
  }

  callApi = async () => {
    const response = await fetch('http://localhost:8080/');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getData(){
    this.callApi()
      .then(res => this.setState({ items: res.data }))
      .catch(err => console.log(err));
  }

  initSocket() {
    socket.on('connect', function(data) {
      socket.emit('join', 'Hello server from client');
    });
    var classptr = this;
    socket.on('queue', function(data) {
      console.log(classptr);
      classptr.getData();
    });
  }

  updateInput(event){
    this.setState({songToAdd : event.target.value})
  }

  handleSubmit() {
    console.log('Song to add: ' + this.state.songToAdd);
    if(this.state.songToAdd.length !== 0) socket.emit('songs', this.state.songToAdd);
  }

  render() {
    return (
      <div className="App" className="container-fluid">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Chat Away!</h1>
        <form className="row">
          <input id="message" className="col-md-4 form-control" type="text" placeholder="Search for a song..." onChange={this.updateInput}></input>
          <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Send</button>
        </form>
        <ul id="queue" className="col-md-8 col-md-offset-2">
          {this.state.items.map(function(d, idx){
          return (<li className="message" key={idx}>{d.name}</li>)
          })}
        </ul>
      </div>
    );
  }
}

export default App;
