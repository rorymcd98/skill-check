import React from 'react'
import { useState } from 'react';


export default function SearchElementForm(props) {
  const searchList = props.searchList;
  const search = searchList[props.idx];
  
  //On every key-stroke, set a new state for the whole form
  const setSearch = (e)=>{
    const newSearchList = [...searchList]
    newSearchList[props.idx] = e.target.value;
    props.setSearchList(newSearchList)
  }

  //Pressing return creates a new search term
  function createNewSearch(e){
    e.preventDefault();
    const newSearchList = [...searchList, ""]
    props.setSearchList(newSearchList)
  }

  function removeButtonEvent(){
    let newSearchList;
    //Handle edge case of removing unitary list
    if(props.searchList.length === 1){
      if(props.searchList[0] === "") return;
      newSearchList = [""];
    } else {

      //Otherwise, in our normal case we remove the current element
      newSearchList = searchList.filter((_, index) => index !== props.idx);
    }
      
    props.setSearchList(newSearchList);
  }

  return (
    <form className='SearchElementForm' id = {`${props.idx}-search-form`} onSubmit={createNewSearch}>
      <button className='SearchElementButton' type = 'button' id = {`${props.idx}-search-remove-button`} style={{'opacity' : '100%'}} onClick={removeButtonEvent}>
          <p>x</p>
      </button>
      <input
        type="text"
        className='SearchElementInput'
        placeholder = {"Search for a skill..."} 
        value={search}
        id="search-input"
        onChange={setSearch}
        autoFocus
      />        
    </form>
  )
}
