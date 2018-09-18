import React, { Component } from 'react';
import gql from 'graphql-tag'

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    login: true,
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { login, email, password, name } = this.state
    
    return (
      <div className="auth">
        <h3>ОАО ГУОВ</h3>
        <div className="flex flex-column">
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Логин или email"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="пароль"
          />
        </div>
        <div className="flex mt3">
          {/* <Mutation
            mutation={LOGIN_MUTATION}
            variables={{ email, password, name }}
            onError={data => this._confirm(data)}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="button" onClick={mutation}>
                {'Вход'}
              </div>
            )}
          </Mutation> */}
          <div className="button" onClick={() => this._confirm(this.state.email)}>
            {'Вход'}
          </div>
        </div>
      </div>
    )
  }

  _confirm = async data => {
    let token = this.state.email;//data.login
    // console.log(this.state);

    this._saveUserData(token)
    // console.log('token',token)
    // console.log(this.props)

    this.props.history.replace(`/`)
  }

  _saveUserData = token => {
    localStorage.setItem('user', token)
    localStorage.getItem('user', (val) => {
      // console.log(val)
    })
  }
}

export default Login
