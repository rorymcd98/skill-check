import { useState, useEffect} from 'react'
import '../css/App.css'
import axios from 'axios'

//Components
import SalaryTimeseriesChart from './components/SalaryTimeseriesChart'
import SalaryDistributionChart from './components/SalaryDistributionChart'
import SkillElementPanel from './components/SkillElementPanel'
import SkillFrequencyChart from './components/SkillFrequencyChart'
import MultiRangeSlider from "multi-range-slider-react";

import initialSkills from './components/component-resources/initialSkills'


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
      'distributionLabels' : ['0k', '5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k', '65k', '70k', '75k'],
      'distributions' : {'[No data]' : []}
    }, 
    'salaryTimeSeries' : {
      '[No data]' : {'scatterPoints': [], 'averageLine': [],}
    },
    'skillsFrequencies' :{
      'counts' : {'[No data]' : []},
      'labels' : {'[No data]': []}
    }
  }

  //chartData state passed to Chart component
  const [chartData, setChartData] = useState(initialChartData);

  const fetchApiOnClick = ()=>{
    const queriesArray = [];

    //Add the custom search list to the query
    if(searchList.length > 0) queriesArray.push(searchList);

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
  const localSearchList = localStorage.getItem("storedSearchList");
  let initialSearchList =  localSearchList ? JSON.parse(localSearchList) : [""];

  const [searchList, setSearchList] = useState(structuredClone(initialSearchList));
  
  //Set local storage when new search terms are made
  useEffect(()=>{
    localStorage.setItem("storedSearchList", JSON.stringify(searchList))
  }, [searchList])

  //Reset the skill states and the local storage
  function resetSkills(){
    
    setSkillElementObject(structuredClone(initialSkills));
    setSearchList([""]);

    localStorage.removeItem("storedSkillElementObject")
    localStorage.removeItem("storedSearchList")
  }
  
  const chartSettings = {
    'topChartWidth' : '575px',
    'topChartHeight' : '450px',
    'skillFrequencyChartWidth' : '90%' 
  }

  //---Block Size--- (granularity of the salary ranges e.g. 5k, 10k, 15k vs 1k, 2k, 3k)
  //Salary block size
  const [salaryBlockSize, setSalaryBlockSize] = useState(5000);

  //---Salary Slider---
  const salaryDistributions = chartData.salaryDistributions;
  const labels = salaryDistributions.distributionLabels;
  const sliderLabels = [labels[0],,,,,,,,,labels[labels.length-1]]

  //Initial boundaries for distribution slider
  const initialMin = 15000;
  const initialMax = (labels.length-1)*salaryBlockSize;

  //States for distribution slider
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  //Handle distribution sliding
  const handleInput = (e) => {
    setTimeout(()=>{
      setMinValue(e.minValue);
      setMaxValue(e.maxValue);
    }, 1000)
  };

  const sliderProps = {
    minValue,
    maxValue,
    handleInput
  }

  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <span id = 'top-charts-panel' style={{'display': 'inline-flex', height: chartSettings.topChartHeight}}>
          <SalaryDistributionChart chartData={chartData} chartSettings={chartSettings} salaryBlockSize={salaryBlockSize} sliderProps={sliderProps}></SalaryDistributionChart>
          <SkillFrequencyChart chartData={chartData} chartSettings={chartSettings}></SkillFrequencyChart>
        </span>
        
        <SalaryTimeseriesChart chartData={chartData} chartSettings={chartSettings} salaryBlockSize={salaryBlockSize} sliderProps={sliderProps}></SalaryTimeseriesChart>

        <span id= 'slider-panel' style={{display : 'inline-flex'}}>
          <MultiRangeSlider
            min={0}
            max={initialMax}
            step={salaryBlockSize}
            minValue={minValue}
            maxValue={maxValue}
            label={true}
            labels={sliderLabels}
            onChange={(e) => {
              handleInput(e);
            }}
            style={{width: chartSettings.topChartWidth}}
          />
        <MultiRangeSlider
          min={0}
          max={initialMax}
          step={salaryBlockSize}
          minValue={minValue}
          maxValue={maxValue}
          label={true}
          labels={sliderLabels}
          key={'different'}
          style={{width: chartSettings.topChartWidth}}
          // onChange={(e) => {
          //   handleInput(e);
          // }}
	    	/>
        </span>


        <button className='AnalyzeSkillsButton' onClick={fetchApiOnClick}>Eventually I get clicked</button>
        <button className='ResetSkillsButton' onClick={resetSkills}>Reset Skills</button>
      </span>
      <SkillElementPanel 
        skillElementObject={skillElementObject} 
        setSkillElementObject={setSkillElementObject}
        searchList={searchList} 
        setSearchList={setSearchList}>
      </SkillElementPanel>
    </div>
  )
}

export default App
