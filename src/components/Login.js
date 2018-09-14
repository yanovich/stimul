import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
    };
  }

  render() {
    return (
      <div>
        <div className="auth">
        <div className="logo">
        <img src=""/>
        </div>
          <input type="text" placeholder="Email" onChange={(e)=>{this.setState({email: e.target.value })}}/>
          <input type="password" placeholder="Пароль" onChange={(e)=>{this.setState({password: e.target.value })}}/>
          <div className="button" onClick={()=>{this._confirm()}}>Войти</div>
        </div>
      </div>
    )
  }

  _confirm = async () => {
    const { name, email, password } = this.state
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })
      const { token } = result.data.login
      this._saveUserData(token)
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      })
      const { token } = result.data.signup
      this._saveUserData(token)
    }
   
  }
  
  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
    this.props.logged = true

  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
  
)(Login)
