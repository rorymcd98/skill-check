import { useState, useEffect} from 'react'
import '../css/App.css'
import axios from 'axios'
import {Chart as ChartJS} from 'chart.js'

//Globally change the color for chart text
ChartJS.defaults.color = '#8f8f8f'

//Components
import SalaryTimeseriesChart from './components/chart-components/SalaryTimeseriesChart'
import SalaryDistributionChart from './components/chart-components/SalaryDistributionChart'
import SkillElementPanel from './components/skill-element-components/SkillElementPanel'
import SkillFrequencyChart from './components/chart-components/SkillFrequencyChart'
import MultiRangeSlider from "multi-range-slider-react";

import initialSkills from './components/component-resources/initialSkills'

//---Helper functions---
//Returns a float for a given Date object (e.g. -> 2022.958)
function dateToFloat(date){
  return date.getFullYear() + date.getMonth()/12 + date.getDate()/365;
}

function dateToLabel(date){
  return date.toLocaleString('en-us', { month: 'short', year: 'numeric' });
}


function App() {  
  //On mount check if we're accessing the API
  useEffect(() => {
    axios
      .get('/api/v1')
      .then(res => {
        //Confirm connection
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const initialChartData = {
    'salaryDistributions' : {
      'distributionLabels' : ["£0k","£5k","£10k","£15k","£20k","£25k","£30k","£35k","£40k","£45k","£50k","£55k","£60k","£65k","£70k","£75k","£80k","£85k","£90k","£95k","£100k","£105k","£110k","£115k","£120k","£125k","£130k","£135k","£140k","£145k","£150k"],
      'distributions' : {'[No-data]' : []}
    }, 
    'salaryTimeSeries' : {
      '[No-data]' : {'scatterPoints': [], 'averageLine': [],}
    },
    'skillsFrequencies' :{
      'counts' : {'[No-data]' : []},
      'labels' : {'[No-data]': []}
    }
  }

  //chartData state passed to Chart component
  const [chartData, setChartData] = useState(initialChartData);

  const fetchApiOnClick = ()=>{
    const queriesArray = [];

    //Add the custom search list to the query
    searchLists.map((searchList)=>{
      if(searchList.length > 0) queriesArray.push(searchList);
    })
      
    //Iterate through the skillElementObject for selected sub-skills
    for(let skill in skillElementObject){
      const curSkill = skillElementObject[skill];
      const skillArray = [];
      
      curSkill.selectedSubSkills.forEach((subSkill)=>{
        skillArray.push(subSkill);
      })

      if(skillArray.length > 0) queriesArray.push(skillArray);
    }


    axios.get('/api/v1/data', {'params': queriesArray})
      .then((res)=>{
        if(!(Object.keys(res.data).length) > 0) {console.error('Empty object returned from API'); return}
        if(!(Object.keys(res.data.salaryDistributions.distributionLabels).length) > 0) {console.error('No distribution data found from API'); return}
        if(!(Object.keys(res.data.salaryTimeSeries).length) > 0) {console.error('No timeseries returned from API'); return}
        setChartData(res.data);
      })
    };

  //---De/selected skill state---
  //Load local storage if available
  const localSkillElementObject = localStorage.getItem("storedSkillElementObject");
  let initialSkillElementObject =  localSkillElementObject ? JSON.parse(localSkillElementObject) : initialSkills;

  const [skillElementObject, setSkillElementObject] = useState(structuredClone(initialSkillElementObject))  

  //Set local storage when skills are selected
  useEffect(()=>{
  localStorage.setItem("storedSkillElementObject", JSON.stringify(skillElementObject))
  }, [skillElementObject])

  //---Custom search list state---
  //Load local storage if available
  const localSearchLists = localStorage.getItem("storedSearchLists");
  let initialSearchLists =  localSearchLists ? JSON.parse(localSearchLists) : [[""] , [""]];

  const [searchLists, setSearchLists] = useState(structuredClone(initialSearchLists));
  
  //Set local storage when new search terms are made
  useEffect(()=>{
    localStorage.setItem("storedSearchLists", JSON.stringify(searchLists))
  }, [searchLists])

  //Reset the skill states and the local storage
  function resetSkills(){
    
    setSkillElementObject(structuredClone(initialSkills));
    setSearchLists(structuredClone(initialSearchLists));

    localStorage.removeItem("storedSkillElementObject")
    localStorage.removeItem("storedSearchLists")
  }
  
  //---Block Size--- (granularity of the salary ranges e.g. 5k, 10k, 15k vs 1k, 2k, 3k)
  //Salary block size
  const [salaryBlockSize, setSalaryBlockSize] = useState(5000);

  //---Salary Slider---
  const salaryDistributions = chartData.salaryDistributions;
  const salarylabels = salaryDistributions.distributionLabels;
  const salarySliderLabels = [salarylabels[0],,,,,,,,,salarylabels[salarylabels.length-1]]

  //Initial boundaries for distribution slider
  const initialMinSalary = 15000;
  const initialMaxSalary = (salarylabels.length-1)*salaryBlockSize;

  //States for distribution slider
  const [minSalary, setMinSalary] = useState(initialMinSalary);
  const [maxSalary, setMaxSalary] = useState(initialMaxSalary);

  //Handle distribution sliding
  const handleInputSalary = (e) => {
    setMinSalary(e.minValue);
    setMaxSalary(e.maxValue);
  };

  //---Date Slider---
  //Initial boundaries for distribution slider
  const initialMinDate = dateToFloat(new Date(2022, 0, 0));
  const initialMaxDate = dateToFloat(new Date());

  const initialMinDateLabel = dateToLabel(new Date(2020, 0, 1));
  const initialMaxDateLabel = dateToLabel(new Date());

  const dateSliderLabels = [initialMinDateLabel,,,,,,,,,,,,,,initialMaxDateLabel]

  //States for distribution slider
  const [minDate, setMinDate] = useState(initialMinDate);
  const [maxDate, setMaxDate] = useState(initialMaxDate);

  //Handle date slider
  const handleInputDate = (e) => {
    setMinDate(e.minValue);
    setMaxDate(e.maxValue);
  };

  //Determine the axes for the timeseries and the salary distribution
  const sliderProps = {
    minSalary,
    maxSalary,
    handleInputSalary,

    minDate,
    maxDate,
    handleInputDate
  }

  //Styling settings for charts
  const chartSettings = {
    'topChartWidth' : '60vh',
    'topChartHeight' : '49vh',
    'topChartMaxWidth' : '30vw',

    'skillFrequencyChartWidth' : '55vh',
    'skillFrequencyChartMaxWidth' : '28vw', 
    
    'timeseriesChartHeight' : '40vh',
    'timeseriesChartWidth' : '126vh',
    'timeseriesChartMaxWidth' : '126vh',//Unused
  }

  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <span id = 'top-charts-panel' style={{'display': 'inline-flex', height: chartSettings.topChartHeight}}>
          <SalaryDistributionChart chartData={chartData} chartSettings={chartSettings} salaryBlockSize={salaryBlockSize} sliderProps={sliderProps}></SalaryDistributionChart>
          <SkillFrequencyChart chartData={chartData} chartSettings={chartSettings}></SkillFrequencyChart>
        </span>
        
        <SalaryTimeseriesChart chartData={chartData} chartSettings={chartSettings} salaryBlockSize={salaryBlockSize} sliderProps={sliderProps}></SalaryTimeseriesChart>

        <span id= 'slider-panel' >
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
          />
          <span id='control-buttons-container'>
            <button className='control-skills-buttons' id='analyze-skills-button' onClick={fetchApiOnClick}>Analyze 🔍</button>
            <button className='control-skills-buttons' id='reset-skills-button' onClick={resetSkills}>Reset ↺</button>
          </span>
        </span>

      </span>
      <SkillElementPanel 
        skillElementObject={skillElementObject} 
        setSkillElementObject={setSkillElementObject}
        searchLists={searchLists} 
        setSearchLists={setSearchLists}>
      </SkillElementPanel>
    </div>
  )
}

export default App
