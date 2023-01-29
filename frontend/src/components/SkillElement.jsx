import React from 'react'

export default function SkillElement(props) {
  const skillElementObject = props.skillElementObject
  return (
    <div className='SkillElement' id = {props.id + '-key'} onClick={(e)=>{
      const id = e.currentTarget.id.split('-')[0];

      const newSkillElementObject = {...skillElementObject};
      newSkillElementObject[id].selected = !newSkillElementObject[id].selected;
      props.setStatePass(newSkillElementObject);
    }}>
        <img className ='SkillElementImage' alt={props.alt} src={`./src/${props.id}/${props.id}.svg`}/>
        <p className='SkillElementText'>{props.name}</p>
    </div>
  )
}
