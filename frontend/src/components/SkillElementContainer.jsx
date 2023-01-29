import React from 'react'
import SkillElement from './SkillElement'

export default function SkillElementContainer(props) {
  const skillElementObject = props.skillElementObject
  return (
    <span className='SkillElementContainer' key= {props.id} id = {props.id}>
      {
        Object.keys(skillElementObject).map((skillId)=>{
          const skill = skillElementObject[skillId];
          if (skill.selected != props.selectedBool){
            return;
          }

          return <SkillElement key={skillId} id={skillId} name={skill.name} skillElementObject={skillElementObject} setStatePass={props.setStatePass}/>
        })
      }
    </span>
  )
}
