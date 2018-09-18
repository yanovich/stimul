import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import 'tachyons';
import './index.css';
// import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
// import { WebSocketLink } from 'apollo-link-ws';
// import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-client-preset';
import { BrowserRouter } from 'react-router-dom';
import { AUTH_TOKEN } from './constants';
import App from './App';
// import { setContext } from 'apollo-link-context';


const httpLink = new HttpLink({
  uri: 'http://185.168.187.103:8500/graphql',
});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;

  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  });

  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache(),
});

// Create a WebSocket link:
// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:8500/`,
//   options: {
//     reconnect: true,
//     authToken: localStorage.getItem(AUTH_TOKEN),
//   }
// });

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return kind === 'OperationDefinition' && operation === 'subscription';
//   },
//   // wsLink,
//   httpLinkWithAuthToken,
// );


// const client = new ApolloClient({ uri: 'http://185.168.187.103:8500/graphql' });
// export const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// })

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
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
