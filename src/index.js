import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';

import 'tachyons';
import './index.css';
import App from './App';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
//import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { BrowserRouter } from 'react-router-dom';
//import { setContext } from 'apollo-link-context';


export const uri = 'http://185.168.187.103:8500/graphql';

const httpLink = new HttpLink({
  uri: 'http://185.168.187.103:8500/graphql'
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://185.168.187.103:8500/`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);
//const client = new ApolloClient({ uri: 'http://185.168.187.103:8500/graphql' });
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

// export function newgql(query, type) {
//   const data = client.query({query: query, type: type})
//   return {
//     type: type,
//     payload: new Promise((resolve, reject) => {
//       data.then(response => resolve(response)).catch(error => reject(error))
//     })
//   }
// }



ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root'),
);
