import React, { useState } from 'react'
import { useEffect } from 'react';
import SearchElementForm from './SearchElementForm';
import SubSkillDropDownContainer from './SubSkillDropDownContainer';

export default function SearchElement(props) {
  //Controls display of 'SubSkillDropDownContainer' and the drop down arrow
  const [display, setDisplay] = useState('block');
  const elementText = 'Custom search'

  //Load local storage if available
  const localSearchList = localStorage.getItem("storedSearchList");
  let initialSearchList =  localSearchList ? JSON.parse(localSearchList) : [""];

  const [searchList, setSearchList] = useState(initialSearchList);
  
  //Set local storage when new search terms are made
  useEffect(()=>{
    localStorage.setItem("storedSearchList", JSON.stringify(searchList))
  }, [searchList])

  function generateSearchChildren(){
    const list = searchList;
    const searchChildren = [];
    list.map((searchTerm , i)=>{
      searchChildren.push(<SearchElementForm key={i} idx = {i} searchTerm = {searchTerm} searchList = {searchList} setSearchList={setSearchList}/>);
    })
    return searchChildren;
  }

  const searchTermList = generateSearchChildren();
  const defaultSearchTerm = <SearchElementForm key={0} idx = {0} searchTerm = {""} searchList = {searchList} setSearchList={setSearchList}/>

  const searchElementChildren = searchTermList.length > 0 ? searchTermList : defaultSearchTerm;

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

        <SubSkillDropDownContainer display={display} id = {props.skillId} children={searchElementChildren}/>
    </div>
  )
}
