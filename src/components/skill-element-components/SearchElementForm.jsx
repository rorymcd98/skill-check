import React from "react";
import { useState } from "react";

export default function SearchElementForm({
  searchLists,
  setSearchLists,
  j,
  idx,
  searchTerm,
}) {
  //On every key-stroke, set a new state for the whole form
  const setSearch = (e) => {
    const newSearchList = structuredClone(searchLists);
    newSearchList[idx][j] = e.target.value;
    setSearchLists(newSearchList);
  };

  //Pressing return creates a new search term
  function createNewSearch(e) {
    e.preventDefault();
    const newSearchList = structuredClone(searchLists);
    newSearchList[idx].push("");
    setSearchLists(newSearchList);
  }

  function removeButtonEvent() {
    let newSearchList;
    const currentSearchList = searchLists[idx];

    //Handle edge case of removing unitary list
    if (currentSearchList.length === 1) {
      if (currentSearchList[0] === "") return;
      newSearchList = [""];
    } else {
      //Otherwise, in our normal case we remove the current element
      newSearchList = currentSearchList.filter((_, index) => index !== j);
    }

    //The higher level state
    const newSearchLists = structuredClone(searchLists);
    newSearchLists[idx] = newSearchList;

    setSearchLists(newSearchLists);
  }

  return (
    <form
      className="SearchElementForm"
      id={`${j}-search-form`}
      onSubmit={createNewSearch}
    >
      <button
        className="SearchElementButton"
        type="button"
        id={`${j}-search-remove-button`}
        style={{ opacity: "100%" }}
        onClick={removeButtonEvent}
      >
        <p>x</p>
      </button>
      <input
        type="text"
        className="SearchElementInput"
        placeholder={"Manually add a skill, [enter], then analyze ...."}
        value={searchTerm}
        id="search-input"
        onChange={setSearch}
        autoFocus
      />
    </form>
  );
}
