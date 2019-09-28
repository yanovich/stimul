import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";

import main from "./main";
import site from "./site";
import login from "./login";
import { SearchBox } from "./SearchBox";
import geosearch from "./geosearch";
import geocoder from "./geocoder";
import ImportSites from "./ImportSites";
import { regionsScreen } from "./Regions";

const screens = {
  main: main,
  site: site,
  login: login,
  geosearch,
  import: null,
  regions: regionsScreen
};

function Logout(props) {
  return (
    <a
      className="location"
      href="/"
      onClick={e => {
        e.preventDefault();
        props.authorize({});
        localStorage.clear();
        props.update("login");
      }}
    >
      Выход
    </a>
  );
}

function Header(props) {
  let location;
  if (props.screen === "main") {
    location = <span className="location">Стимул</span>;
  } else {
    location = (
      <a
        className="location"
        href="/"
        onClick={e => {
          e.preventDefault();
          props.update("main");
        }}
      >
        Стимул
      </a>
    );
  }
  return (
    <header>
      <SearchBox geosearch={props.geosearch}></SearchBox>
      {location}&nbsp;
      <a
        className="location"
        href="#1"
        onClick={e => {
          e.preventDefault();
          props.go("import");
        }}
      >
        Импорт объектов
      </a>
      <a
        className="location"
        href="#1"
        onClick={e => {
          e.preventDefault();
          props.go("regions");
        }}
      >
        Регионы
      </a>
      &nbsp;
      <Logout {...props} />
    </header>
  );
}

function Stimul() {
  const [state, setState] = React.useState(() => {
    return (
      JSON.parse(window.localStorage.getItem("stimul-state")) || {
        auth: {},
        screen: "import",
        response: {}
      }
    );
  });

  function authorize(auth) {
    const newState = state;
    state.auth = auth;
    window.localStorage.setItem("stimul-state", JSON.stringify(newState));
    setState(newState);
  }

  function gql(query, variables, cb) {
    fetch("/graphql", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + state.auth.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
      .then(response => {
        return response.json();
      })
      .then(cb);
  }

  function update(nextScreen, variables) {
    gql(screens[nextScreen].query, variables, response => {
      const newState = {
        auth: state.auth,
        screen: nextScreen,
        response: response.data
      };
      window.localStorage.setItem("stimul-state", JSON.stringify(newState));
      setState(newState);
    });
  }

  function go(screen) {
    setState(prevState => {
      let newState = { ...prevState, screen };
      window.localStorage.setItem("stimul-state", JSON.stringify(newState));
      return newState;
    });
  }

  function geosearch(searchText) {
    geocoder(searchText).then(features => {
      const sites = features.map(f => ({
        address: f.properties.geocoding.label,
        latlng: f.geometry.coordinates.reverse()
      }));
      const newState = {
        auth: state.auth,
        screen: "geosearch",
        response: { sites }
      };
      setState(newState);
    });
  }

  const props = {
    authorize,
    gql,
    response: state.response,
    update
  };

  const screenProps = {
    authorize,
    geosearch,
    screen: state.screen,
    update,
    go
  };
  console.log(state.screen);
  if (state.screen === "import")
    return (
      <>
        <Header {...screenProps} />
        <ImportSites />
      </>
    );
  return (
    <React.Fragment>
      {state.screen !== "login" && <Header {...screenProps} />}
      {screens[state.screen].render(props)}
    </React.Fragment>
  );
}

// ========================================

ReactDOM.render(<Stimul />, document.getElementById("root"));
