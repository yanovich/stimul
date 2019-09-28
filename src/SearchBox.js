import React, { useState } from "react";
import geocoder from "./geocoder";

window.geocoder = geocoder;
export function SearchBox(props) {
  const [searchText, setSearchText] = useState("");
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        console.log(e);
        geocoder(searchText).then();
      }}
      className="search"
    >
      <input
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      ></input>
      <button type="submit">Поиск</button>
    </form>
  );
}
