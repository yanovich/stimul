import React, { useState } from "react";
import geocoder from "./geocoder";
import { Input } from "antd";

window.geocoder = geocoder;
export function SearchBox(props) {
  const [searchText, setSearchText] = useState("");
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        props.geosearch(searchText);
      }}
      className="search"
    >
      <Input
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      ></Input>
      <button type="submit">Поиск</button>
    </form>
  );
}
