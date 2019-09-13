import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import main from './main'
import site from './site'
import login from './login'

const screens = {
  main: main,
  site: site,
  login: login
}

function Stimul () {
  const [state, setState] = React.useState(() => {
    return window.localStorage.getItem('stimul-state') || {
      auth: {},
      screen: 'login',
      response: {}
    }
  })

  function authorize (auth) {
    const newState = state
    state.auth = auth
    setState(newState)
  }

  function gql (query, variables, cb) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + state.auth.token,
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

  function update (nextScreen, variables) {
    gql(screens[nextScreen].query, variables, response => {
      setState({
        auth: state.auth,
        screen: nextScreen,
        response: response.data
      })
    })
  }

  const props = {
    authorize,
    gql,
    response: state.response,
    update
  }

  console.log(state)
  return screens[state.screen].render(props)
}

// ========================================

ReactDOM.render(<Stimul />, document.getElementById('root'))
