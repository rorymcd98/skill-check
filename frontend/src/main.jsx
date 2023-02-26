import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/App.css'

import { LazyLoadImage } from "react-lazy-load-image-component";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div id='logo-image-container'>
      <LazyLoadImage id ='logo-image' alt={'Logo'} src={`./skill-icon-large.png`}/>
    </div>
    <App/>
  </React.StrictMode>,
)
