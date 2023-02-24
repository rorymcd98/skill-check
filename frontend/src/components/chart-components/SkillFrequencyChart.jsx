import React, {useEffect, useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import backgroundColorSelection from '../component-resources/chart-colours';

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
      text: 'Job Skill Frequencies',
      position: 'top',
      align: 'start',
      fullSize: true,
      font : {weight: 'bold', size: '15rem'},
      color: '#d1d1d1',
    },
  },
  maintainAspectRatio: false,
  scales: {
    'y' : {
      'title' : {
        'display' : true,
        'text' : 'Number of Jobs'
      }
    }
  }
};



export default function SkillFrequencyChart({chartData}) {
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

  //Change the chart number if the number of charts shrinks
  useEffect(()=>{
    const bound = Math.min(selectedChartNumber, barComponents.length-1);
    setSelectedChartNumber(bound);
  }, [chartData])

  //Generate a bar chart component of skill frequency for each job query
  const barComponents = [];
  let index = 0;

  //Display a summary chart of all the total before displaying each individual chart
  const summaryChartData = [];
  const summaryChartLabels = [];

  const skillsFrequencies = chartData.skillsFrequencies;

  Object.keys(skillsFrequencies.counts).map((jobQuery)=>{
    const summaryData = [skillsFrequencies.counts[jobQuery][0]]; //0 index leads to the total
    const summaryLabel = jobQuery.split(' ')[0];

    summaryChartData.push(summaryData);
    summaryChartLabels.push(summaryLabel);
  })


  const summaryChartDatasets = 
  [{
    label : 'Summary Chart',
    data: summaryChartData,
    backgroundColor: Object.values(backgroundColorSelection)
  }]

  //Summary chart data
  const data = {
    labels: summaryChartLabels,
    datasets: summaryChartDatasets
  };

  const selected = selectedChartNumber == index;
  const opacity = selected ? '100%' : '0%';
  const zIndex = selected ? '-1' : '-2';
  const transition = selected ?  'opacity 0.4s cubic-bezier(.91,-0.01,.91,.4)' : 'opacity 0.4s cubic-bezier(0,.8,.18,1)';

  const summaryChart = 
  <Bar key ={'summary-chart'}
    options={options}
    data={data} 
    style={{position: 'relative',
            opacity,
            zIndex,
            transition
          }}
  />

  //Start the bar components list with our summary
  barComponents.push(summaryChart)

  //Index = 1 -> First chart after the summary
  index = 1;
  //Iterate through each job query and produce a chart representing the frequency of each skill
  Object.keys(skillsFrequencies.counts).map((jobQuery)=>{
    const datasets = 
    [{
      label : jobQuery,
      data: skillsFrequencies.counts[jobQuery],
      backgroundColor: backgroundColorSelection[index-1]
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
              transition
            }}
    />)

    index++;
  })



  return (
    <div className = 'SkillFrequencyChart' >
      <button className='SkillFrequencyChartArrow' id='left-arrow' onClick={prevChart}/>
      <button className='SkillFrequencyChartArrow' id='right-arrow' onClick={nextChart}/>
      <span className='BarComponentContainer' id = 'bar-component-container'  
        style={{
          transform: `translateX(-${100*selectedChartNumber}%)`
        }}>
        {barComponents}
      </span>
      
    </div>  
  )
}


