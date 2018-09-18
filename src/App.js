import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import Drafts from './components/Drafts';
import DraftGroup from './components/DraftGroup';
import Board from './components/Board';
import Home from './components/Home';
import Card from './components/Card';
import LeftNav from './components/LeftNav';
import LeftBar from './components/LeftBar';
// import gql from 'graphql-tag';
import Login from './components/Login';
import Profile from './components/Profile';
// import { stat } from 'fs';

import { AUTH_TOKEN } from './constants'

export const qf = (_url, ...params) => {
  return fetch(_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      params
    })
  })
    .then(r => r.json())
    .then(data => console.warn("quf data", data))
    .then(data => data)
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      logged: false,
      lbar: true,
      barstate: 'chat',
      user: true,
    };
    this._lbarstate = this._lbarstate.bind(this);
    this.lookft = this.lookft.bind(this);

  }

  _lbarstate = (state) => {
    // let newState = '';

    if (this.state.barstate === state) {
      this.setState({
        lbar: !this.state.lbar,
        barstate: state,
      })
    } else {
      this.setState({
        lbar: true,
        barstate: state,
      })
    }
  }

  logState(value) {
    this.setState({ logged: value });
  }

  lookft() {
    let authToken = localStorage.getItem(AUTH_TOKEN)

    if (authToken) {
      this.setState({
        user: true,
      })
    }

  }

  ltrim() {

  }

  componentDidMount() {
    let user = localStorage.getItem('username');

    if (!user) {
      this.setState({ logged: false });
    } else {
      this.setState({ logged: true });
    }
  }


  render() {
    // let username = '';
    // let logged = this.state.logged;
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <Fragment>
        {!authToken ? (
          <Login lookft={this.lookft} />
        ) : (
          <Fragment>
            <LeftNav lstate={this._lbarstate} />
            {this.state.lbar ? (<LeftBar lstate={this.state.lbar} barstate={this.state.barstate} ltrim={this.ltrim} />) : ''}

            <div className={this.state.lbar ? 'main-container' : 'main-container full'}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/projectgroup/:id" component={DraftGroup} />
                <Route exact path="/projects/:id" component={Drafts} />
                <Route exact path="/project/:id" component={Board} />
                <Route exact path="/card/:id" component={Card} />
                <Route exact path="/profile" component={Profile} />
              </Switch>

            </div>
          </Fragment>
        )
        }
      </Fragment>
    )
  }

}

export default withRouter(App);




