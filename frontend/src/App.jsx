import { useState } from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SearchInput from './components/SearchInput'
import SkillElementPanel from './components/SkillElementPanel'

function App() {

  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <Chart ></Chart>
        <SearchInput/>
      </span>
      <SkillElementPanel>Test</SkillElementPanel>
    </div>
  )
}

export default App
