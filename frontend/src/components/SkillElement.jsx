import React from 'react'

export default function SkillElement(props) {
    
  return (
    <div key ={props.name + '-key'} className='SkillElement'>
        <img className ='SkillElementImage' alt={props.alt} src={`./src/${props.name}/${props.name}.svg`}/>
        <p className='SkillElementText'>{props.name}</p>
    </div>
  )
}
