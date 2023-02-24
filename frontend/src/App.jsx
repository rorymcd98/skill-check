import { useState, useEffect} from 'react'
import '../css/App.css'
import axios from 'axios'
import {Chart as ChartJS} from 'chart.js'

//Globally change the color for chart text
ChartJS.defaults.color = '#8f8f8f';

ChartJS.defaults.scale.grid.color = 'rgba(127, 127, 127, 0.34)';



//Components
import SalaryTimeseriesChart from './components/chart-components/SalaryTimeseriesChart'
import SalaryDistributionChart from './components/chart-components/SalaryDistributionChart'
import SkillElementPanel from './components/skill-element-components/SkillElementPanel'
import SkillFrequencyChart from './components/chart-components/SkillFrequencyChart'
import SliderPanel from './components/skill-element-components/SliderPanel'

import initialSkills from './components/component-resources/initialSkills'
import initialChartData from './components/component-resources/initialChartData'

//Helper for the dates
function dateToFloat(date){
  return date.getFullYear() + date.getMonth()/12 + date.getDate()/365;
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

  //Dummy data in case needed (old)
  const emptyData = {
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
  let initialSearchLists =  localSearchLists ? JSON.parse(localSearchLists) : [[""]]; //Start with a single blank list

  const [searchLists, setSearchLists] = useState(structuredClone(initialSearchLists));
  
  //Set local storage when new search terms are made
  useEffect(()=>{
    localStorage.setItem("storedSearchLists", JSON.stringify(searchLists))
  }, [searchLists])

  //Reset the skill states and the local storage
  function resetSkills(){
    
    setSkillElementObject(structuredClone(initialSkills));
    setSearchLists(structuredClone([[""]]));

    localStorage.removeItem("storedSkillElementObject")
    localStorage.removeItem("storedSearchLists")
  }
  
  //---Block Size--- (granularity of the salary ranges e.g. 5k, 10k, 15k vs 1k, 2k, 3k)
  //Salary block size
  const [salaryBlockSize, setSalaryBlockSize] = useState(5000);

  //---Salary Slider---
  const salaryDistributions = chartData.salaryDistributions;
  const salaryLabels = salaryDistributions.distributionLabels;

  //Initial boundaries for distribution slider
  const initialMinSalary = 15000;
  const initialMaxSalary = (salaryLabels.length-1)*salaryBlockSize;

  //States for distribution slider
  const [minSalary, setMinSalary] = useState(initialMinSalary);
  const [maxSalary, setMaxSalary] = useState(initialMaxSalary);


  //---Date Slider---
  //Initial boundaries for distribution slider
  const initialMinDate = dateToFloat(new Date(2022, 0, 0));
  const initialMaxDate = dateToFloat(new Date());

  //States for distribution slider
  const [minDate, setMinDate] = useState(initialMinDate);
  const [maxDate, setMaxDate] = useState(initialMaxDate);


  //Determine the axes for the timeseries and the salary distribution
  const sliderProps = {
    minSalary,
    maxSalary,

    minDate,
    maxDate,
  }

  const SliderPanelComponent = <SliderPanel
      minSalary={minSalary}
      maxSalary={maxSalary}
      setMinSalary={setMinSalary}
      setMaxSalary={setMaxSalary}
      initialMaxSalary={initialMaxSalary}
      salaryBlockSize={salaryBlockSize}
      salaryLabels={salaryLabels}
      initialMaxDate={initialMaxDate}
      minDate={minDate}
      maxDate={maxDate}
      setMinDate={setMinDate}
      setMaxDate={setMaxDate}
      resetSkills={resetSkills}
      fetchApiOnClick={fetchApiOnClick}
    />

  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <span id = 'top-charts-panel'>
          <SalaryDistributionChart chartData={chartData}  salaryBlockSize={salaryBlockSize} sliderProps={sliderProps}></SalaryDistributionChart>
          <SkillFrequencyChart chartData={chartData} ></SkillFrequencyChart>
        </span>
        <SalaryTimeseriesChart chartData={chartData}  salaryBlockSize={salaryBlockSize} sliderProps={sliderProps}></SalaryTimeseriesChart>
      </span>

      <SkillElementPanel 
        skillElementObject={skillElementObject} 
        setSkillElementObject={setSkillElementObject}
        searchLists={searchLists} 
        setSearchLists={setSearchLists}
        SliderPanelComponent={SliderPanelComponent}  
      />
    </div>
  )
}

export default App
