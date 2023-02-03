import React from 'react';
import { useState } from 'react';
import '../../css/SkillElementPanel.css';
import SkillElementContainer from './SkillElementContainer';
import SkillElement from './SkillElement';



export default function SkillElementPanel() {    

	const initialSkills = {
    'c': {
        'name': 'C',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'cpp': {
        'name': 'C++',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'csharp': {
        'name': 'C#',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'css': {
        'name': 'CSS',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'go': {
        'name': 'Go',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'go-old': {
        'name': 'Go (Old)',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'haskell': {
        'name': 'Haskell',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'html': {
        'name': 'HTML',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'java': {
        'name': 'Java',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'javascript': {
        'name': 'JavaScript',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'kotlin': {
        'name': 'Kotlin',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'lua': {
        'name': 'Lua',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'php': {
        'name': 'PHP',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'python': {
        'name': 'Python',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': [],
    },
    'r': {
        'name': 'R',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'ruby': {
        'name': 'Ruby',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'swift': {
        'name': 'Swift',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    },
    'typescript': {
        'name': 'TypeScript',
        'deselectedSubSkills': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'],
        'selectedSubSkills': []
    }
  }

  const [skillElementObject, setSkillElementObject] = useState(structuredClone(initialSkills))   
    

    //Toggles all the sub skills of an Element
    function createToggleAll(skillId, selectAllBool){

        function toggleAll(){
            const newSkillElementObject = structuredClone(skillElementObject);
            newSkillElementObject[skillId].deselectedSubSkills = !selectAllBool ? [...initialSkills[skillId].deselectedSubSkills] : [];
            newSkillElementObject[skillId].selectedSubSkills = selectAllBool ? [...initialSkills[skillId].deselectedSubSkills] : [];
            
            setSkillElementObject(newSkillElementObject);
        }

        return toggleAll;
    }

    function createToggleSubSkill(skillId, subSkillName, selectBool){

        function toggleSubSkill(){
            const newSkillElementObject = structuredClone(skillElementObject);
            const deselectedSubSkills = newSkillElementObject[skillId].deselectedSubSkills;
            const selectedSubSkills = newSkillElementObject[skillId].selectedSubSkills;

            const swapElement = (arr1, arr2)=>{
                const subSkillIndex = arr1.indexOf(subSkillName);
                arr1.splice(subSkillIndex,1);
                arr2.push(subSkillName);
            }

            if(selectBool){
                swapElement(deselectedSubSkills, selectedSubSkills);
            } else {
                swapElement(selectedSubSkills, deselectedSubSkills);
            }
                
            setSkillElementObject(newSkillElementObject);
        }
        
        return toggleSubSkill;
    }


    //Assemble the object into a list of SkillElement chidlren - this is passed to each SkillElementContainer
    function objectToSkillList(skillElementObject, selectedBool){
        const skillElementList = [];
        Object.keys(skillElementObject).map((skillId)=>{
            const skill = skillElementObject[skillId];

            const areSelectedSkills = skill.selectedSubSkills.length > 0 && selectedBool;
            const aredeselectedSkills = skill.deselectedSubSkills.length > 0 && !selectedBool;

            //If nothing relevant is selected, don't render this element
            if (!(areSelectedSkills || aredeselectedSkills)) return;

            skillElementList.push(<SkillElement key={skillId} skillId={skillId} name={skill.name} onClick={createToggleAll(skillId, !selectedBool)} skillElementObject={skillElementObject} createToggleSubSkill={createToggleSubSkill} selectedBool={selectedBool}/>)
        })

        return skillElementList;
    }

  const idSelected = 'SkillSelected';
  const idMenu = 'SkillMenu';

  return (
    <span className='SkillElementPanel'>
      <SkillElementContainer  key = {idSelected} id={idSelected} children={objectToSkillList(skillElementObject, true)} />
      <SkillElementContainer  key = {idMenu} id={idMenu} children={objectToSkillList(skillElementObject, false)}/>
    </span>
  )
}
