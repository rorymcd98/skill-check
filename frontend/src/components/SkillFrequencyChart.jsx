import React, {useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import backgroundColorSelection from './component-resources/chart-colours';
import {CSSTransition} from 'react-transition-group';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
  maintainAspectRatio: false
};



export default function SkillFrequencyChart({chartData, chartSettings}) {
  //State for scrolling between charts
  const [selectedChartNumber, setSelectedChartNumber] = useState(0);

  const nextChart = () => {
    const next = Math.min(selectedChartNumber+1, barComponents.length-1);
    setSelectedChartNumber(next)
  }

  const prevChart = () => {
    const prev = Math.max(selectedChartNumber-1, 0);
    setSelectedChartNumber(prev)
  }

  //Generate a bar chart component of skill frequency for each job query
  const barComponents = [];
  let index = 0;

  const skillsFrequencies = chartData.skillsFrequencies;
  Object.keys(skillsFrequencies.counts).map((jobQuery)=>{
    const datasets = 
    [{
      label : jobQuery,
      data: skillsFrequencies.counts[jobQuery],
      backgroundColor: backgroundColorSelection[index]
    }]

    const labels = skillsFrequencies.labels[jobQuery];

    const data = {
      labels,
      datasets
    };

    const selected = selectedChartNumber == index;
    const opacity = selected ? '100%' : '0%';
    const zIndex = selected ? '-1' : '-2';
    const transition = selected ?  'opacity 0.4s cubic-bezier(.91,-0.01,.91,.4)' : 'opacity 0.4s cubic-bezier(0,.8,.18,1)';

    barComponents.push(
    <Bar key ={jobQuery}
      options={options}
      data={data} 
      style={{position: 'relative',
              opacity,
              zIndex,
              height: chartSettings.topChartHeight,
              width: chartSettings.skillFrequencyChartWidth,
              transition
            }}
    />)

    index++;
  })



  return (
    <div className = 'SkillFrequencyChart' style={{width: chartSettings.topChartWidth}}>
      <button className='SkillFrequencyChartArrow' id='left-arrow' onClick={nextChart}/>
      <span className='BarComponentContainer' id = 'bar-component-container'  
        style={{
          width:chartSettings.skillFrequencyChartWidth,
          transform: `translateX(-${100*selectedChartNumber}%)`,
          transition: 'transform 0.4s cubic-bezier(.52,-0.01,.5,1)'
        }}>
        
        {barComponents}
      </span>
      <button className='SkillFrequencyChartArrow' id='right-arrow' onClick={prevChart}/>
    </div>  
  )
}


