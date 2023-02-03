import React from 'react'

export default function SkillElementContainer(props) {
  const skillElementObject = props.skillElementObject

  return (
    <span className='SkillElementContainer' key= {props.id} id = {props.id}>
      {props.children}
    </span>
  )
}
