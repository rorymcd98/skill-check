import { useState } from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SearchInput from './components/SearchInput'
import SlideupMenu from './components/SlideupMenu'

function App() {

  return (
    <div id={'main-container'}>
      <Chart></Chart>
      <SearchInput/>
      <SlideupMenu>Test</SlideupMenu>
    </div>
  )
}

export default App
