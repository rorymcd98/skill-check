import React from 'react'
import { useState } from 'react'
import '../../css/SlideupMenu.css'
import SlideupButton from './SlideupButton';

export default function SlideupMenu() {
  const [top, setTop] = useState('90%');

  function handleClick(){
    setTop(top === '60%' ? '90%' : '60%');
  }
  
  return (
    <div className='SlideupMenu' style={{top}} onClick = {() => handleClick()}>SlideupMenu
      <SlideupButton></SlideupButton>
      <div className='menuContainer'></div>
    </div>
  )
}
