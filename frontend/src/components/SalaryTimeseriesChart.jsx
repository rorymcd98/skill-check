import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  TimeScale
} from 'chart.js';
import { Scatter} from 'react-chartjs-2';
import backgroundColorSelection from './component-resources/chart-colours';

import 'chartjs-adapter-moment';

ChartJS.register(
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend,   
  CategoryScale,
  Title,
  TimeScale
  );

export default function SalaryTimeseriesChart({chartData, chartSettings, salaryBlockSize, sliderProps}) {
  const salaryTimeSeries = chartData.salaryTimeSeries;

  //Create the dataset object for chart JS
  const datasets = [];
  let colorIndex = 0;

  Object.keys(salaryTimeSeries).forEach((jobQuery) => {
    //Push the scatter points datset
    datasets.push(
      {
        label: `${jobQuery} points`,
        data: salaryTimeSeries[jobQuery].scatterPoints,
        backgroundColor: backgroundColorSelection[colorIndex],
        showLine: false,
        ticks: {
          min: 50000,
          max: 100000
        }
      }
    )
    //Push the average line dataset
    datasets.push(
      {
        label: `${jobQuery} line`,
        data: salaryTimeSeries[jobQuery].averageLine,
        backgroundColor: 'rgba(255, 99, 0, 0)',
        borderColor: backgroundColorSelection[colorIndex],
        showLine: true
      }
    )

    colorIndex++;
  });
  

  const data = {
    datasets
  };
  
  const options = {
    type: 'scatter',
    scales: {
      y: {
          min: sliderProps.min,
          max: sliderProps.max
      },
      x: {
        beginAtZero: false,
        type: 'time'
      },
    },
    //On click open a scatter point job in a URL (the first of many if a cluster is chosen)
    onClick: (chart, point)=>{
      const firstKey = Object.keys(point)[0];
      const firstPoint = point[firstKey];
      const url = firstPoint.element.$context.raw.url;

      window.open(url, '_blank', 'noreferrer');
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const jobTitle = context.dataset.data[context.dataIndex].label || '';

            const label = `${jobTitle} - £${context.parsed.y/1000}k \n (${context.dataset.label.split(' ')[0]})`;
            return label;
          }
        }
      }
    }
  };



  return (
    <div className='SalaryTimeSeries' id='salary-time-series'>
      <Scatter options={options} data={data} />
    </div>

  );
}
