import React from 'react'
import { useState } from 'react';


export default function SearchForm() {

  function handleSubmit(e){
    e.preventDefault();
    
  }

  const [search, setSearch] = useState("");

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder = {"Search for a skill..."} 
        value={search}
        id="search-input"
        onChange={(e)=>setSearch(e.target.value)}
      />
      <input type="submit"/>
    </form>

  )
}
