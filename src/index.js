import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import main from './main'
import login from './login'

const screens = {
  'main': main,
  'login': login
}

class Stimul extends React.Component {
  constructor (props) {
    super(props)
    this.state = window.localStorage.getItem('stimul-state') || {
      screen: 'login',
      response: {}
    }
  }

  update (nextScreen) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: screens[nextScreen].query,
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
    const props = {
      response: this.state.response,
      update: this.update.bind(this)
    }
    let screen = screens[this.state.screen].render(props)

    return (
      <div className='stimul'>
        {screen}
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Stimul />, document.getElementById('root'))
