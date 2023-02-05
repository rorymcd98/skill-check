import { useState } from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SkillElementPanel from './components/SkillElementPanel'

function App() {

  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <Chart ></Chart>
        <button className='AnalyzeSkillsButton'>Eventually I get clicked</button>
      </span>
      <SkillElementPanel>Test</SkillElementPanel>
    </div>
  )
}

export default App
