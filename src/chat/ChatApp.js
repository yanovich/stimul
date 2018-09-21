import React, { Component } from 'react'
import io from 'socket.io-client'
import config from '../config'
import Messages from './Messages'
import ChatInput from './ChatInput'


class ChatApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
    this.sendHandler = this.sendHandler.bind(this)
    this.socket = io(config.api, {
      query: `username= ${props.username}`
    }).connect()

    this.socket.on('server:message', message => {
      this.addMessage(message)
    })
  }

  sendHandler = message => {
    const messageObject = {
      username: this.props.username,
      message
    }

    if (message === "history") {
      this.socket.emit('client:history')
    } else {
      this.socket.emit('client:message', messageObject)
      messageObject.fromMe = true
      this.addMessage(messageObject)
    }
  }

  addMessage = message => {
    const messages = this.state.messages
    
    messages.push(message)
    this.setState({ message })
  }

  render() {
    return (
      <div className='chat-container'>
        <Messages messages={this.state.messages} />
        <ChatInput onSend={this.sendHandler} />
      </div>
    )
  }
}

ChatApp.defaultProps = {
  username: 'Anonymous'
}

export default ChatApp
