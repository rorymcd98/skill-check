import React from 'react';
import { useState } from 'react';
import '../../css/SkillElementPanel.css';
import SkillElementContainer from './SkillElementContainer';
import SkillElement from './SkillElement';

export default function SkillElementPanel() {


  const [skillElementObject, setSkillElementObject] = useState({
    'c': {
        'name': 'C',
        'selected': false
    },
    'cpp': {
        'name': 'C++',
        'selected': false
    },
    'csharp': {
        'name': 'C#',
        'selected': false
    },
    'css': {
        'name': 'CSS',
        'selected': false
    },
    'go': {
        'name': 'Go',
        'selected': false
    },
    'go-old': {
        'name': 'Go (Old)',
        'selected': false
    },
    'haskell': {
        'name': 'Haskell',
        'selected': false
    },
    'html': {
        'name': 'HTML',
        'selected': false
    },
    'java': {
        'name': 'Java',
        'selected': false
    },
    'javascript': {
        'name': 'JavaScript',
        'selected': false
    },
    'kotlin': {
        'name': 'Kotlin',
        'selected': false
    },
    'lua': {
        'name': 'Lua',
        'selected': false
    },
    'php': {
        'name': 'PHP',
        'selected': false
    },
    'python': {
        'name': 'Python',
        'selected': false,
        'children': ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas']
    },
    'r': {
        'name': 'R',
        'selected': false
    },
    'ruby': {
        'name': 'Ruby',
        'selected': false
    },
    'swift': {
        'name': 'Swift',
        'selected': false
    },
    'typescript': {
        'name': 'TypeScript',
        'selected': false
    }
  })   


  //Create eventHandlers for the SkillElements
    function clickHandler(e){
        const id = e.currentTarget.id.split('-')[0];

        const newSkillElementObject = {...skillElementObject};
        newSkillElementObject[id].selected = !newSkillElementObject[id].selected;
        setSkillElementObject(newSkillElementObject);
    }

  //Assemble the object into a list of children - pass this to each SkillElementContainer
  function skillObjectToList(skillElementObject, selectedBool){
    const skillElementList = [];
    Object.keys(skillElementObject).map((skillId)=>{
        const skill = skillElementObject[skillId];
        if (skill.selected != selectedBool){
          return;
        }
         skillElementList.push(<SkillElement key={skillId} id={skillId} name={skill.name} skillElementObject={skillElementObject} onClick={clickHandler}/>)
      })

    return skillElementList;
  }

  const idSelected = 'SkillSelected';
  const idMenu = 'SkillMenu';

  return (
    <span className='SkillElementPanel'>
      <SkillElementContainer  key = {idSelected} id={idSelected} children={skillObjectToList(skillElementObject, true)} />
      <SkillElementContainer  key = {idMenu} id={idMenu} children={skillObjectToList(skillElementObject, false)}/>
    </span>
  )
}
