import React from 'react'
import Message from './Message'
//import PerfectScrollbar from 'perfect-scrollbar';
class Messages extends React.Component {
  componentDidUpdate() {
    const objDiv = document.getElementById('messageList')

    objDiv.scrollTop = objDiv.scrollHeight
  }
  componentDidMount(){

  }

  render() {
    const messages = this.props.messages.map((message, i) => {
      return (
        <Message
          key={i}
          username={message.username}
          message={message.message}
          date={message.date}
          fromMe={message.fromMe}
        />
      )
    })
    
    return (
      <div className='messages' id='messageList'>
        {messages}
      </div>
    )
  }
}

Messages.defaultProps = {
  messages: []
}

export default Messages
