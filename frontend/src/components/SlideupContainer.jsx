import React from 'react'
import { useState } from 'react'
import '../../css/SlideupContainer.css'
import SlideupButton from './SlideupButton';
import SlideupMenu from './SlideupMenu';
import SlideupSelected from './SlideupSelected';

export default function SlideupContainer() {
  const [left, setTop] = useState('90%');

  function handleClick(){
    setTop(left === '0%' ? '80%' : '50%');
  }
  
  return (
    <span className='SlideupContainer' style={{left}} onClick = {() => handleClick()}>SlideupContainer
      <SlideupButton></SlideupButton>
      <SlideupSelected></SlideupSelected>
      <SlideupMenu></SlideupMenu>
    </span>
  )
}
