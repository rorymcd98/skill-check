import React from 'react'

export default function DropDownSubSkills(props) {
  return (
    <div className='DropDownSubSkills' style={{'display':'none'}}>
    {
        props.children.map((subSkill)=>{
          return (
            <div className='SubSkill' key = {`${props.id}-${subSkill}-key`}>
              {subSkill}
            </div>
          )
        })
      }
    </div>
  )
}
