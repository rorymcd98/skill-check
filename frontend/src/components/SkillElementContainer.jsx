import React from 'react'
import SkillElement from './SkillElement'

export default function SkillElementContainer(props) {
  const skillElementObject = props.skillElementObject
  return (
    <span className='SkillElementContainer' key= {props.id} id = {props.id}>
      {props.children}
      
    </span>
  )
}
