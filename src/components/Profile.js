import React, { Component } from 'react';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
      name: '',
      logged: false,
    };

  }

  getUserNamePass = () => {
    if (!this.state.email || this.state.email.length < 3) {
      return false;
    } else {
      localStorage.removeItem('username')
      localStorage.setItem('username', this.state.email)
    }
  }

  componentDidMount() {
    let user = localStorage.getItem('username');
    if (!user) {
      // console.log('no usr', user )
      this.setState({ logged: false });
    } else {
      this.setState({ email: user });
    }
  }

  render() {
    return (
      <div className="auth">
        <h3>Привет, {this.state.user}!</h3>
        <div>Вы можете изменить своё имя</div>
        <input type="text" placeholder="новый Логин или Email" onChange={(e) => {
          this.setState({ email: e.target.value });
          console.log(this.state.email)
        }} />
        <div className="button" onClick={() => { this.getUserNamePass() }}>изменить имя</div>
      </div>
    )
  }
}

export default Profile;
