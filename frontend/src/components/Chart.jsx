import React, {useEffect, useRef, useState} from 'react';
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
import MultiRangeSlider from "multi-range-slider-react";
import '../../css/ChartPanel.css'

export default function Chart({chartData}) {
  const salaryHistograms = chartData.salaryHistograms;
  const labels = salaryHistograms.histogramLabels;
  const histograms = salaryHistograms.histograms;

  //---slider variables---
  //Histogram block size
  const blockSize = 5000;

  //Initial boundaries for histogram slider
  const initialMin = 15000;
  const initialMax = (labels.length-1)*blockSize;
  
  const [max, setMax] = useState(initialMax);

  //States for histogram slider
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const minHistogramIndex = Math.ceil(minValue/blockSize);
  const maxHistogramIndex = Math.floor(maxValue/blockSize)+1;

  const backgroundColorSelection = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)'
  ];

  const displayLabels = labels.slice(minHistogramIndex, maxHistogramIndex)

  //Format the object to be rendered
  const datasets = [];
  let colorIndex = 0;
  Object.keys(histograms).forEach((searchTerm) => {
      datasets.push(
        {
          label: searchTerm,
          data: histograms[searchTerm].slice(minHistogramIndex, maxHistogramIndex),
          backgroundColor: backgroundColorSelection[colorIndex],
        }
      )
      colorIndex++;
  });

  console.log('here')


  //Data passed to the chart component
  const data = {
    labels: displayLabels,
    datasets: datasets
  };

  //Update histogram sliders when new data is input
  useEffect(()=>{
    setMax(initialMax)
    setMinValue(initialMin)
    setMaxValue(initialMax)
  }, [chartData])

  //Handle histogram sliding
  const handleInput = (e) => {
    setMinValue(e.minValue);
    setMaxValue(e.maxValue);
  };

  const sliderLabels = [labels[0],,,,,,,,,labels[labels.length-1]]

  return (<div className = 'Chart' style={{position: 'relative', width: "62vh"}}>
     <Bar options={options} data={data}/>
     <MultiRangeSlider
			min={0}
			max={max}
			step={blockSize}
			minValue={minValue}
			maxValue={maxValue}
      label={true}
      labels={sliderLabels}
			onChange={(e) => {
				handleInput(e);
			}}
		/>

  </div>);
}

//Chart JS backend
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
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
    maintainAspectRatio : true
  },
};
