import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SCREENS = {
  MAIN: Symbol('main'),
  LOGIN: Symbol('login')
}

function MainScreen (props) {
  return (
    <div className='stimul-info'>
      <p>{props.response.hello}</p>
    </div>
  )
}

function LoginScreen (props) {
  return (
    <div className='stimul-info'>
      <button onClick={() => props.update('{hello}', SCREENS.MAIN)}>Hello</button>
    </div>
  )
}

class Stimul extends React.Component {
  constructor (props) {
    super(props)
    this.state = window.localStorage.getItem('stimul-state') || {
      screen: SCREENS.LOGIN,
      response: {}
    }
  }

  update (request, nextScreen) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: request,
        variables: null
      })
    }).then(response => {
      return response.json()
    }).then(response => {
      this.setState({
        screen: nextScreen,
        response: response.data
      })
    })
  }

  render () {
    let screen
    switch (this.state.screen) {
      case SCREENS.MAIN:
        screen = (
          <MainScreen
            response={this.state.response}
            update={this.update.bind(this)}
          />)
        break
      case SCREENS.LOGIN:
        screen = (
          <LoginScreen
            response={this.state.response}
            update={this.update.bind(this)}
          />)
        break
    }

    return (
      <div className='stimul'>
        {screen}
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Stimul />, document.getElementById('root'))
