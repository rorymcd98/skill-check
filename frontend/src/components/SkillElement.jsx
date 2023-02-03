import React, { useState } from 'react'
import SubSkillDropDownContainer from './SubSkillDropDownContainer';
import SubSkillElement from './SubSkillElement'

export default function SkillElement(props) {
  //Controls display of 'SubSkillDropDownContainer' and the drop down arrow
  const [display, setDisplay] = useState(props.selectedBool ? 'block' : 'none');

  //Assemble the object into a list of subSkillElement chidlren - this is passed to each subSkillDropDownContainer child
  function objectToSubSkillList(skillElementObject, selectedBool){
    const subSkillElementList = [];
    const skillObject = skillElementObject[props.skillId];

    const subSkillList = selectedBool ? skillObject.selectedSubSkills : skillObject.deselectedSubSkills;
    const skillId = props.skillId

    subSkillList.map((subSkillName)=>{
          subSkillElementList.push(<SubSkillElement key = {`${skillId}-${subSkillName}-key`} skillId={skillId} subSkillName={subSkillName} onClick={props.createToggleSubSkill(skillId, subSkillName, !selectedBool)}/>)
    })

    return subSkillElementList;
  }


  const subSkillChildren = objectToSubSkillList(props.skillElementObject, props.selectedBool);

  return (
    <div className='SkillElement' id = {props.skillId + '-key'} >
        <div className='SkillElementHead' onClick={()=>{setDisplay(display === 'block' ? 'none' : 'block')}}>
          <span className='SkillElementImageContainer'>
            <img className ='SkillElementImage' alt={props.alt} src={`./src/${props.skillId}/${props.skillId}.svg`}/>
          </span>
          <span className='SkillElementText'>
            <p>{props.name}</p>
          </span>
          <span className='SkillElementArrow'>
            <p>{display === 'none' ? '▲' : '▼'}</p>
          </span>
          <button className='SelectAllButton' id = {props.skillId + '-button'} onClick={props.onClick}>
            <p>+</p>
          </button>
        </div>
        <SubSkillDropDownContainer display={display} id = {props.skillId} children={subSkillChildren}/>
    </div>
  )
}
