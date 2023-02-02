import React, { Fragment } from 'react'
import DropDownSubSkills from './DropDownSubSkills';

export default function SkillElement(props) {

  const children = ['Python', 'Python 2', 'Python 3', 'NumPy', 'Pandas'];

  return (
    <div className='SkillElement' id = {props.id + '-key'} >
        <span className='SkillElementImageContainer'>
          <img className ='SkillElementImage' alt={props.alt} src={`./src/${props.id}/${props.id}.svg`}/>
        </span>
        <span className='SkillElementText'>
          <p>{props.name}</p>
        </span>
        <button className='SelectAllButton' id = {props.id + '-button'} onClick={props.onClick}>
          <p>+</p>
        </button>
        <DropDownSubSkills children={children} id = {props.id}/>
    </div>
  )
}
