import "./login.css";

import React, { useState, useEffect } from "react";

import logo from "./logo.svg";

const login = `
mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      email
    }
  }
}`;

function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    props.gql(
      login,
      { email: "admin-1@example.com", password: "111111111" },
      response => {
        if (response.data.login) {
          props.authorize(response.data.login);
          props.update("main");
        }
      }
    );
  }, []);

  return (
    <div className="stimul-info">
      <form
        className="auth"
        onSubmit={e => {
          e.preventDefault();
          props.gql(login, { email, password }, response => {
            if (response.data.login) {
              props.authorize(response.data.login);
              props.update("main");
            }
          });
        }}
      >
        <div>
          <img src={logo} className="logo" alt="Стимул" />
        </div>
        <label className="LabelInputText">
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className="LabelInputText">
          <input
            id="password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Вход</button>
      </form>
    </div>
  );
}

export default {
  render: props => {
    return <LoginScreen {...props} />;
  }
};
