import React from 'react'
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function TutorialPanel({toggleDisplayTutorial, tutorialStyling}) {

  return (
  <div id='tutorial-panel-backdrop' style={tutorialStyling}>
    <div id='tutorial-panel' >
        <div id='tutorial-panel-images'>
          <div className='TutorialImageContainer'>
            <div className='TutorialPanelNumber'>1.</div>
            <LazyLoadImage className='TutorialImage'  src='./tutorial-images/preset.png'></LazyLoadImage>
          </div>
          <div className='TutorialImageContainer'>
            <div className='TutorialPanelNumber'>2.</div>
            <LazyLoadImage className='TutorialImage'  src='./tutorial-images/custom.png'></LazyLoadImage> 
          </div>
          <div className='TutorialImageContainer'>
            <div className='TutorialPanelNumber'>3.</div>
            <LazyLoadImage className='TutorialImage'  src='./tutorial-images/analyze.png'></LazyLoadImage> 
          </div>
          <div className='TutorialImageContainer'>
            <div className='TutorialPanelNumber'>4.</div>
            <LazyLoadImage className='TutorialImage'  src='./tutorial-images/reset.png'></LazyLoadImage> 
          </div>
          <div className='TutorialImageContainer'>
            <div className='TutorialPanelNumber'>5.</div>
            <LazyLoadImage className='TutorialImage'  src='./tutorial-images/sliders.png'></LazyLoadImage> 
          </div>
          <div className='TutorialImageContainer'>
            <div className='TutorialPanelNumber'>6.</div>
            <LazyLoadImage className='TutorialImage'  src='./tutorial-images/minimise.png'></LazyLoadImage> 
          </div>
        </div>
        <div id='tutorial-panel-footer'>
          <button id='tutorial-close-button' onClick={toggleDisplayTutorial}>
            <div id='tutorial-close-button-text'>
            X
            </div>
          </button> 
        </div>
      </div>
    </div>
  )
}
