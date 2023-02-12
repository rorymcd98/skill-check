import { useState, useEffect} from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SkillElementPanel from './components/SkillElementPanel'
import initialSkills from '../public/initialSkills'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:3001';

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
    }
  }

  //chartData state passed to Chart component
  const [chartData, setChartData] = useState(initialChartData);

  const buttonClickFunction = ()=>axios.get('/api/v1/data', {'params': ['python', 'javascript' , 'c++']})
    .then((res)=>{
      setChartData(res.data);
    });

  //De/selected skill state
  //Load local storage if available
  const localSkillElementObject = localStorage.getItem("storedSkillElementObject");
  let initialSkillElementObject =  localSkillElementObject ? JSON.parse(localSkillElementObject) : initialSkills;

  const [skillElementObject, setSkillElementObject] = useState(initialSkillElementObject)  

  //Set local storage when skills are selected
  useEffect(()=>{
  localStorage.setItem("storedSkillElementObject", JSON.stringify(skillElementObject))
  }, [skillElementObject])




  //Custom search list state
  //Load local storage if available
  const localSearchList = localStorage.getItem("storedSearchList");
  let initialSearchList =  localSearchList ? JSON.parse(localSearchList) : [""];

  const [searchList, setSearchList] = useState(initialSearchList);
  
  //Set local storage when new search terms are made
  useEffect(()=>{
    localStorage.setItem("storedSearchList", JSON.stringify(searchList))
  }, [searchList])




  return (
    <div id={'MainContainer'}>
      <span id = 'ChartPanel'>
        <Chart chartData={chartData}></Chart>
        <button className='AnalyzeSkillsButton' onClick={buttonClickFunction}>Eventually I get clicked</button>
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
