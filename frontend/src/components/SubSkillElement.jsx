import React from 'react'

export default function SubSkillElement({skillId, subSkillName, onClick}) {
  // console.log(skillId, subSkillName)

  return (
      <div className='SubSkill' key = {`${skillId}-${subSkillName}-key`} >
          <button className='SubSkillButton' id = {`${skillId}-${subSkillName}-button`} onClick={onClick}>
              <p>+</p>
          </button>
        {subSkillName}
      </div>
  )
}
