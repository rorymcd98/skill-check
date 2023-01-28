import React from 'react'
import SkillElement from './SkillElement'

export default function SlideupMenu(props) {
  const skillElementList = ['c' , 'cpp', 'csharp', 'css', 'go', 'go-old', 'haskell', 'html', 'java', 'javascript', 'kotlin', 'lua', 'php', 'python', 'r', 'ruby', 'swift', 'typescript']
    return (
    <span className='SkillElementContainer' id = 'SlideupMenu'>{
        skillElementList.map((skillElement)=>{
            return <SkillElement name={skillElement}/>
        })
    }</span>
 
  )
}
