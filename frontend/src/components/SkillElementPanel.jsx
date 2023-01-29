import React from 'react';
import { useState } from 'react';
import '../../css/SkillElementPanel.css';
import SkillElementContainer from './SkillElementContainer';

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
        'selected': false
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


  return (
    <span className='SkillElementPanel'>
      <SkillElementContainer  key = 'SkillSelected' id='SkillSelected' skillElementObject={skillElementObject} selectedBool = {true} setStatePass ={setSkillElementObject}/>
      <SkillElementContainer  key = 'SkillMenu' id='SkillMenu' skillElementObject={skillElementObject} selectedBool = {false} setStatePass ={setSkillElementObject}/>
    </span>
  )
}
