import React from 'react'
import { useState } from 'react';


export default function SearchForm() {
  const placeholder = "Search for a skill...";
  const [search, setSearch] = useState("");
  return (
    <input
      type="text"
      placeholder = {placeholder} 
      value={search}
      id="search-input"
      onChange={(e)=>setSearch(e.target.value)}
    />
  )
}
