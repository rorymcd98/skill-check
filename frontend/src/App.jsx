import { useState, useEffect} from 'react'
import '../css/App.css'
import Chart from './components/Chart'
import SkillElementPanel from './components/SkillElementPanel'
import initialSkills from '../public/initialSkills'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:3001';

function App() {
  const list = ['python', 'javascript' , 'c++'];
  useEffect(() => {
    axios
      .get('/api/v1')
      .then(res => {
        //console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const fun = ()=>axios.get('/api/v1/data').then((res)=>console.log(res.data));

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
        <Chart ></Chart>
        <button className='AnalyzeSkillsButton' onClick={fun}>Eventually I get clicked</button>
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
