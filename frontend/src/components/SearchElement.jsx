import React, { useState } from 'react'

export default function SearchElement(props) {
  //Controls display of 'SubSkillDropDownContainer' and the drop down arrow
  const [display, setDisplay] = useState('block');
  const elementText = 'Custom search'

  return (
    <div className='SearchElement' id = {props.skillId} >
        <div className='SkillElementHead' onClick={()=>{setDisplay(display === 'block' ? 'none' : 'block')}}>
          <span className='SkillElementImageContainer'>
            <img className ='SkillElementImage' alt={elementText} src={`./skill-icon-small.png`}/>
          </span>
          <span className='SkillElementText'>
            <p>{elementText}</p>
          </span>
          <span className='SkillElementArrow'>
            <p>{display === 'none' ? 'ᐳ' : 'ᐯ'}</p>
          </span>
        </div>
    </div>
  )
}
