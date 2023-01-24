import { useState } from 'react'
import './App.css'
import SearchInput from './components/SearchInput'
import Graph from './components/Graph'

function App() {
  console.log('here')
  return (
    <div className="App">
      <Graph></Graph>
      <SearchInput>Text</SearchInput>
    </div>
  )
}

export default App
