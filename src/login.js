import './login.css'

import React from 'react'

import logo from './logo'

const LoginScreen = {
  render: props => {
    return (
      <div className='stimul-info'>
        <div className='auth'>
          <div className='logo'>
            <img src={logo} alt='АО ГУОВ' />
          </div>
          <label className='LabelInputText'>
            <input type='text' placeholder='Email' />
          </label>
          <label className='LabelInputText'>
            <input type='password' placeholder='Пароль' />
          </label>
          <button onClick={() => props.update('main')}>Вход</button>
        </div>
      </div>
    )
  }
}

export default LoginScreen
