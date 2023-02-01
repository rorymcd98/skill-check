import React from 'react'

export default function SkillElement(props) {
  return (
    <div className='SkillElement' id = {props.id + '-key'} onClick={props.onClick}>
        <span className='SkillElementImageContainer'>
          <img className ='SkillElementImage' alt={props.alt} src={`./src/${props.id}/${props.id}.svg`}/>
        </span>
        <span className='SkillElementText'>
          <p>{props.name}</p>
        </span>
    </div>
  )
}
