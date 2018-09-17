import React, {Component,Fragment} from 'react';
//import ReactDOM from 'react-dom';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { withRouter } from 'react-router'
//import { BrowserRouter } from 'react-router-dom'
// import { ApolloProvider } from 'react-apollo';
// import ApolloClient from 'apollo-boost';
// import Draft from './components/Draft';
import Drafts from './components/Drafts';
import DraftGroup from './components/DraftGroup';
// import Create from './components/Create';
import Board from './components/Board';
// import Proj from './components/Proj';
// import ProjGr from './components/ProjGr';
// import GetById from './components/GetById';
import Home from './components/Home';
import Card from './components/Card';

import LeftNav from './components/LeftNav'; 
import LeftBar from './components/LeftBar'; 
// import localforage from 'localforage';
// import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Login from './components/Login';
import Profile from './components/Profile';
import { stat } from 'fs';


import { AUTH_TOKEN } from './constants'

export const qf = (_url, ...params) =>{
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
      .then(data => console.log("quf data",data))
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
    };
    this._lbarstate = this._lbarstate.bind(this);

  }

  _lbarstate = (state)=>{
    let newState = '';
    if(this.state.barstate === state){
      this.setState({
        lbar: !this.state.lbar,
        barstate: state,
      })
    }else{
      this.setState({
        lbar: true,
        barstate: state,
      })
    }
  }

  logState(value) {
    this.setState({logged: value});
  }


  ltrim(){
    
  }

  // getUserNamePass = () => {
  //   if(!this.state.email || this.state.email.length < 3 ){
  //     return false;
  //   }else{
  //     this.setState({logged: true});
  //     localStorage.setItem('logged', true)
  //     localStorage.removeItem('username')
  //     localStorage.setItem('username', this.state.email)
  //   }
    
  // }

  componentDidMount(){
    let user = localStorage.getItem('username');
    if(!user){
      this.setState({logged: false});
    }else{
      this.setState({logged: true});
    }
  }


  render() {
    let username = '';
    let logged = this.state.logged;
    const authToken = localStorage.getItem(AUTH_TOKEN)

      return (
        <div>
           {!authToken ? (
              <Login />
                ) : (
          <Fragment>
          <LeftNav lstate={this._lbarstate} />
          <LeftBar lstate={this.state.lbar} barstate={this.state.barstate} ltrim={this.ltrim} />
          <div className={this.state.lbar ? 'main-container':'main-container full'}>
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
          </div>
        )
    }
  
}

export default withRouter(App);




