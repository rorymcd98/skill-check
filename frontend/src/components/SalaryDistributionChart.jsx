import React, {useEffect, useRef, useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import '../../css/ChartPanel.css'
import backgroundColorSelection from './component-resources/chart-colours';

//Chart JS backend
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    }
  },
  maintainAspectRatio: false
};


import { Line } from 'react-chartjs-2';


export default function SalaryDistributionChart({chartData, chartSettings, salaryBlockSize, sliderProps}) {
  const salaryDistributions = chartData.salaryDistributions;
  const labels = salaryDistributions.distributionLabels;
  const distributions = salaryDistributions.distributions;

  const minSalary = sliderProps.minSalary;
  const maxSalary = sliderProps.maxSalary;


  //Determine which labels we should use based on slider 'minSalary' 'maxSalary'
  const minDistributionIndex = Math.ceil(minSalary/salaryBlockSize);
  const maxDistributionIndex = Math.floor(maxSalary/salaryBlockSize)+1;

  const displayLabels = labels.slice(minDistributionIndex, maxDistributionIndex);

  //Format the dataset object to be rendered
  const datasets = [];
  let colorIndex = 0;
  Object.keys(distributions).forEach((searchTerm) => {
      datasets.push(
        {
          label: searchTerm,
          data: distributions[searchTerm].slice(minDistributionIndex, maxDistributionIndex),
          backgroundColor: backgroundColorSelection[colorIndex],
          showLine: true,
          borderColor: backgroundColorSelection[colorIndex],
          cubicInterpolationMode: 'monotone',
          spanGaps: true
        }
      )
      colorIndex++;
  });


  //Data passed to the chart component
  const data = {
    labels: displayLabels,
    datasets: datasets
  };


  return (
  <div className = 'SalaryDistributionChart' style={{position: 'relative', width: chartSettings.topChartWidth}}>
     <Line options={options} data={data} style={{position: 'relative', height: chartSettings.topChartHeight}}/>
  </div>);
}

