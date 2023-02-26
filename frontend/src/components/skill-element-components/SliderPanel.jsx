import React from 'react'
import MultiRangeSlider from "multi-range-slider-react";

//---Helper functions---
//Returns a float for a given Date object (e.g. -> 2022.958)
function dateToLabel(date){
  return date.toLocaleString('en-us', { month: 'short', year: 'numeric' });
}

export default function SliderPanel({minSalary, maxSalary, setMinSalary, setMaxSalary, initialMaxSalary, salaryBlockSize, salaryLabels,
                                     initialMaxDate, minDate, maxDate, setMinDate, setMaxDate,
                                     fetchApiOnClick, resetSkills}) {
  

  //---Salary Slider---
  const salarySliderLabels = [salaryLabels[0],,,,,,,,,salaryLabels[salaryLabels.length-1]]

  //Handle distribution sliding
  const handleInputSalary = (e) => {
    setMinSalary(e.minValue);
    setMaxSalary(e.maxValue);
  };

  //---Date Slider---
  const initialMinDateLabel = dateToLabel(new Date(2020, 0, 1));
  const initialMaxDateLabel = dateToLabel(new Date());

  const dateSliderLabels = [initialMinDateLabel,,,,,,,,,,,,,,initialMaxDateLabel]

  //Handle date slider
  const handleInputDate = (e) => {
    setMinDate(e.minValue);
    setMaxDate(e.maxValue);
  };


                                        
  return (
    <span id= 'slider-panel' >
      <span id='slider-container'>
        <MultiRangeSlider
          key='salary-slider'
          id='salary-slider'
          min={0}
          max={initialMaxSalary}
          step={salaryBlockSize}
          minValue={minSalary}
          maxValue={maxSalary}
          label={true}
          labels={salarySliderLabels}
          onChange={(e) => {
            handleInputSalary(e);
          }}
        />
        <MultiRangeSlider
          key='date-slider'
          id='date-slider'
          min={2020}
          max={initialMaxDate}
          step={0.0001}
          minValue={minDate}
          maxValue={maxDate}
          label={true}
          labels={dateSliderLabels}
          onChange={(e) => {
            handleInputDate(e);
          }}
        ></MultiRangeSlider>
      </span>
      
      <span id='control-buttons-container'>
        <button className='control-skills-buttons' id='analyze-skills-button' onClick={fetchApiOnClick}>Analyze 🔍</button>
        <button className='control-skills-buttons' id='reset-skills-button' onClick={resetSkills}>Reset ↺</button>
      </span>
    </span>
  )
}
