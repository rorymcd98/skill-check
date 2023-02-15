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
import MultiRangeSlider from "multi-range-slider-react";
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
    },
    maintainAspectRatio : true
  },
};


import { Line } from 'react-chartjs-2';


export default function SalaryDistributionChart({chartData}) {
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

  //Determine which labels we should use based on slider 'minValue' 'maxValue'
  const minHistogramIndex = Math.ceil(minValue/blockSize);
  const maxHistogramIndex = Math.floor(maxValue/blockSize)+1;


  const displayLabels = labels.slice(minHistogramIndex, maxHistogramIndex)

  //Format the dataset object to be rendered
  const datasets = [];
  let colorIndex = 0;
  Object.keys(histograms).forEach((searchTerm) => {
      datasets.push(
        {
          label: searchTerm,
          data: histograms[searchTerm].slice(minHistogramIndex, maxHistogramIndex),
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


  //Handle histogram sliding
  const handleInput = (e) => {
    setTimeout(()=>{
      setMinValue(e.minValue);
      setMaxValue(e.maxValue);
    }, 50)
  };

  

  //Update histogram sliders when new data is input to truncate / remove outliers
  useEffect(()=>{
    setTimeout(()=>{
      setMax(initialMax)
      setMinValue(initialMin)
      setMaxValue(Math.min(initialMax,150000))
    }, 100)
  }, [chartData])

  const sliderLabels = [labels[0],,,,,,,,,labels[labels.length-1]]

  return (<div className = 'Chart' style={{position: 'relative', width: "62vh"}}>
     <Line options={options} data={data}/>
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

