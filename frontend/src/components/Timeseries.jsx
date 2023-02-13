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
} from 'chart.js';
import { Scatter, Line } from 'react-chartjs-2';
import backgroundColorSelection from './component-resources/chart-colours';

ChartJS.register(
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend,   
  CategoryScale,
  Title,
  );

export default function Timeseries({chartData}) {
  const salaryTimeSeries = chartData.salaryTimeSeries;

  //Format the dataset object to be rendered
  const datasets = [];
  let colorIndex = 0;
  Object.keys(salaryTimeSeries).forEach((jobQuery) => {
    //Push the scatter points datset
    datasets.push(
      {
        label: `${jobQuery} points`,
        data: salaryTimeSeries[jobQuery].scatterPoints,
        backgroundColor: backgroundColorSelection[colorIndex],
        showLine: false
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          max: 100
        }
      },
      x: {
        beginAtZero: false,
        ticks: {
          min: 0,
          max: 100
        }
      }
    },
  };

  return (
    <div>
      <Scatter options={options} data={data} />
    </div>

  );
}
