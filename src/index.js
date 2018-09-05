import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';


import 'tachyons';
import './index.css';
import App from './App';

const client = new ApolloClient({ uri: 'http://185.168.187.103:8500/graphql' });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root'),
);
