import React from 'react';
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
import '../../../css/ChartPanel.css'
import backgroundColorSelection from '../component-resources/chart-colours';

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

//Chart JS options
const options = {
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Salary Distributions',
      position: 'top',
      align: 'start',
      fullSize: true,
      font : {weight: 'bold', size: '20rem'},
      color: '#d1d1d1',
    }
  },
  maintainAspectRatio: false,
  scales: {
    'y' : {
      'title' : {
        'display' : true,
        'text' : 'Relative Job Frequency'
      }
    }
  }
};


import { Line } from 'react-chartjs-2';


export default function SalaryDistributionChart({chartData, salaryBlockSize, sliderProps}) {
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
  <div className = 'SalaryDistributionChart'>
     <Line options={options} data={data} />
  </div>);
}

