import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Hello extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      response: {}
    }
  }

  update (request) {
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
        response: response.data
      })
    })
  }

  render () {
    let status
    if (this.state.response && this.state.response.hello) {
      status = <p>{this.state.response.hello}</p>
    } else {
      status = <button onClick={() => this.update('{hello}')}>Hello</button>
    }

    return (
      <div className='hello'>
        <div className='hello-info'>
          {status}
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Hello />, document.getElementById('root'))
