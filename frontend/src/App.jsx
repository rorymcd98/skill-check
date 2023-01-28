import { useState } from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SearchInput from './components/SearchInput'
import SlideupContainer from './components/SlideupContainer'

function App() {

  return (
    <span id={'main-container'}>
      <Chart ></Chart>
      <SearchInput/>
      <SlideupContainer>Test</SlideupContainer>
    </span>
  )
}

export default App
