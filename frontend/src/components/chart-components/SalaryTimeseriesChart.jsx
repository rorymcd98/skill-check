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
import backgroundColorSelection from '../component-resources/chart-colours';

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

///---Helpers---
//Helper function to make the dots more transparent
function changeColorTransparency(color, transparency) {
  // Split the color string into its individual RGBA components
  var rgba = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.\d+|\d+)\)$/);
  var r = rgba[1];
  var g = rgba[2];
  var b = rgba[3];
  // Convert the transparency value to a decimal number between 0 and 1
  var a = transparency / 100;
  // Create a new color string with the updated transparency
  var newColor = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  return newColor;
}

//Turns a float (from the slider) back into a date
function floatToDate(float){
  const year = Math.floor(float);
  const month = Math.floor(12*(float%1));
  return new Date(year, month, 28)
}


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
        backgroundColor: changeColorTransparency(backgroundColorSelection[colorIndex], 30),
        showLine: false,
      }
    )
    //Push the average line dataset
    datasets.push(
      {
        label: `${jobQuery} line`,
        data: salaryTimeSeries[jobQuery].averageLine,
        backgroundColor: 'rgba(255, 99, 0, 0)',
        borderColor: backgroundColorSelection[colorIndex],
        showLine: true,
        spanGaps: true
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
          min: sliderProps.minSalary,
          max: sliderProps.maxSalary,
          'title' : {
            'display' : true,
            'text' : 'Salary (£)'
          }
      },
      x: {
        type: 'time',
        min: floatToDate(sliderProps.minDate),
        max: floatToDate(sliderProps.maxDate),
      },
    },
    maintainAspectRatio: false,

    //On click open a scatter point job in a URL (the first of many if a cluster is chosen)
    onClick: (chart, point)=>{
      const firstKey = Object.keys(point)[0];
      const firstPoint = point[firstKey];
      const url = firstPoint.element.$context.raw.url;

      window.open(url, '_blank', 'noreferrer');
    },

    //Configure the plugins
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const jobTitle = context.dataset.data[context.dataIndex].label || '';

            const label = `${jobTitle} - £${context.parsed.y/1000}k \n (${context.dataset.label.split(' ')[0]})`;
            return label;
          }
        }
      }, 
      legend: {
        position: 'top',

      },
      title: {
        display: true,
        text: 'Salary Timeseries',
        position: 'top',
        align: 'start',
        fullSize: true,
        font : {weight: 'bold', size: '20vh'},
        color: '#d1d1d1',
      },
    },

  };



  return (
    <div className='SalaryTimeSeries' id='salary-time-series' style={{width : chartSettings.timeseriesChartWidth, height : chartSettings.timeseriesChartHeight}}>
      <Scatter options={options} data={data} />
    </div>

  );
}
