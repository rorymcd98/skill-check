import { useState, useEffect} from 'react'
import '../css/App.css'
import axios from 'axios'

//Components
import SalaryTimeseriesChart from './components/SalaryTimeseriesChart'
import SalaryDistributionChart from './components/SalaryDistributionChart'
import SkillElementPanel from './components/SkillElementPanel'

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
    'salaryHistograms' : {
      'histogramLabels' : ['0k', '5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k', '65k', '70k', '75k'],
      'histograms' : {'' : []}
    }, 
    'salaryTimeSeries' : {
      '[No data]' : {'scatterPoints': [], 'averageLine': [],}
    }
  }

  //chartData state passed to Chart component
  const [chartData, setChartData] = useState(initialChartData);

  const buttonClickFunction = ()=>{
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
        if(!(Object.keys(res.data.salaryHistograms.histogramLabels).length) > 0) {console.error('No histogram data found from API'); return}
        if(!(Object.keys(res.data.salaryTimeSeries).length) > 0) {console.error('No timeseries returned from API'); return}
        setChartData(res.data);
      })
    };
  

  //---De/selected skill state---
  //Load local storage if available
  const localSkillElementObject = localStorage.getItem("storedSkillElementObject");
  let initialSkillElementObject =  localSkillElementObject ? JSON.parse(localSkillElementObject) : initialSkills;

  const [skillElementObject, setSkillElementObject] = useState(initialSkillElementObject)  

  //Set local storage when skills are selected
  useEffect(()=>{
  localStorage.setItem("storedSkillElementObject", JSON.stringify(skillElementObject))
  }, [skillElementObject])

  //---Custom search list state---
  //Load local storage if available
  const localSearchList = localStorage.getItem("storedSearchList");
  let initialSearchList =  localSearchList ? JSON.parse(localSearchList) : [""];

  const [searchList, setSearchList] = useState(initialSearchList);
  
  //Set local storage when new search terms are made
  useEffect(()=>{
    localStorage.setItem("storedSearchList", JSON.stringify(searchList))
  }, [searchList])

  //Reset the skill states and the local storage
  function resetSkills(){
    localStorage.setItem("storedSkillElementObject", JSON.stringify(initialSkillElementObject))
    localStorage.setItem("storedSearchList", JSON.stringify(initialSearchList))

    setSkillElementObject(initialSkillElementObject);
    setSearchList(initialSearchList);
  }
  
  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <SalaryDistributionChart chartData={chartData}></SalaryDistributionChart>
        <SalaryTimeseriesChart chartData={chartData}></SalaryTimeseriesChart>

        <button className='AnalyzeSkillsButton' onClick={buttonClickFunction}>Eventually I get clicked</button>
        <button className='ResetSkillsButton' onClick={resetSkills}></button>
      </span>
      <SkillElementPanel 
      skillElementObject={skillElementObject} 
      setSkillElementObject={setSkillElementObject}
      searchList={searchList} 
      setSearchList={setSearchList}>
        Test
      </SkillElementPanel>
    </div>
  )
}

export default App
