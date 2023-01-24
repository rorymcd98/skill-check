import React from 'react'

export default function SlideupButton(props) {
  const content = props.content;
  const handleClick = props.onClick;
  
    return (
    <div className='SlideupButton'>
        {content}
    </div>
  )
}
