import React, { Component } from 'react';
import ChatApp from './ChatApp';
import './App.css';

class Appср extends Component {
  constructor(props) {
    super(props)
    this.state = { username: '' }

    this.usernameChangeHandler = this.usernameChangeHandler.bind(this)
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this)
  }
  componentDidMount() {
    let user = localStorage.getItem('username');

    this.setState({ username: user });
  }

  usernameChangeHandler = event => {
    this.setState({ username: this.state.username })
  }
  usernameSubmitHandler = event => {
    event.preventDefault()
    this.setState({ submitted: true, username: this.state.username })
  }

  render() {
    return <ChatApp username={this.state.username} />
  }
}
Appср.defaultProps = {}

export default Appср
