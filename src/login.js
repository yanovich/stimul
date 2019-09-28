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

  const { gql, authorize, update } = props;

  useEffect(() => {
    gql(
      login,
      { email: "admin-1@example.com", password: "111111111" },
      response => {
        if (response.data.login) {
          authorize(response.data.login);
          update("main");
        }
      }
    );
  }, [gql, authorize, update]);

  return (
    <div className="stimul-info">
      <form
        className="auth"
        onSubmit={e => {
          e.preventDefault();
          gql(login, { email, password }, response => {
            if (response.data.login) {
              authorize(response.data.login);
              update("main");
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
