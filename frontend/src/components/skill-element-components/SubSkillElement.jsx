import React from 'react'

export default function SubSkillElement({skillId, subSkillName, onClick, selectedBool}) {

  return (
      <div className='SubSkill' >
          <button className='SubSkillButton' id = {`${skillId}-${subSkillName}-button`} onClick={onClick}>
              <p>{selectedBool ? '-' : '+'}</p>
          </button>
        <span className='SubSkillText'>{subSkillName}</span>
      </div>
  )
}
