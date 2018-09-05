import React, {Component,Fragment} from 'react';
//import ReactDOM from 'react-dom';
import {
  NavLink,
  Link,
  Redirect,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
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

import LeftNav from './components/LeftNav'; 
import LeftBar from './components/LeftBar'; 
// import localforage from 'localforage';
// import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// import Login from './components/Login';
import Profile from './components/Profile';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      logged: false,
    };

  }

  getUserNamePass = () => {
    if(!this.state.email || this.state.email.length < 3 ){
      return false;
    }else{
      this.setState({logged: true});
      localStorage.setItem('logged', true)
      localStorage.removeItem('username')
      localStorage.setItem('username', this.state.email)
    }
    
  }

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


    if(!this.state.logged){
      return(
        <div className="auth">
          <input type="text" placeholder="Логин или Email" onChange={(e)=>{this.setState({email: e.target.value });console.log(this.state.email)}}/>
          <input type="password" placeholder="Пароль" onChange={(e)=>{this.setState({password: e.target.value });}}/>
          <div className="button" onClick={()=>{this.getUserNamePass()}}>Войти</div>
        </div>
      )
    }else{
      return (
        <Router>
          <Fragment>
            
          <LeftNav/>
          <LeftBar/>
          <div className="main-container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/projectgroup/:id" component={DraftGroup} />
              <Route exact path="/projects/:id" component={Drafts} />
              <Route exact path="/project/:id" component={Board} />
              <Route exact path="/profile" component={Profile} />
            </Switch>
          </div>
          
        </Fragment>
        </Router>
        )
    }


  }
}

export default App;




