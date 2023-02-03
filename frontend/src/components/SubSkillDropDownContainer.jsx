import React from 'react'

export default function SubSkillDropDownContainer(props) {
  return (
    <div className='SubSkillDropDownContainer' style={{'display': props.display}}>
      {props.children}
    </div>
  )
}
