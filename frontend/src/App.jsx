import { useState } from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SearchForm from './components/SearchForm'
import SkillElementPanel from './components/SkillElementPanel'

function App() {

  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <Chart ></Chart>
        <SearchForm/>
      </span>
      <SkillElementPanel>Test</SkillElementPanel>
    </div>
  )
}

export default App
