import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import main from './main'
import login from './login'

const screens = {
  main: main,
  login: login
}

class Stimul extends React.Component {
  constructor (props) {
    super(props)
    this.state = window.localStorage.getItem('stimul-state') || {
      auth: {},
      screen: 'login',
      response: {}
    }
  }

  authorize (auth) {
    this.setState({ auth })
  }

  gql (query, variables, cb) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.state.auth.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
      .then(response => {
        return response.json()
      })
      .then(cb)
  }

  update (nextScreen, variables) {
    this.gql(screens[nextScreen].query, variables, response => {
      this.setState({
        screen: nextScreen,
        response: response.data
      })
    })
  }

  render () {
    const props = {
      authorize: this.authorize.bind(this),
      gql: this.gql.bind(this),
      response: this.state.response,
      update: this.update.bind(this)
    }
    return screens[this.state.screen].render(props)
  }
}

// ========================================

ReactDOM.render(<Stimul />, document.getElementById('root'))
