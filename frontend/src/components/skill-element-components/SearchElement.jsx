import React, { useState } from 'react'
import { useEffect } from 'react';
import SearchElementForm from './SearchElementForm';
import SubSkillDropDownContainer from './SubSkillDropDownContainer';
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function SearchElement({skillId, searchLists, setSearchLists, idx}) {
  //Controls display of 'SubSkillDropDownContainer' and the drop down arrow
  const [display, setDisplay] = useState('block');
  const elementText = 'Custom search' + (searchLists.length>1 ? ` ${idx+1}` : '');

  function generateSearchChildren(){
    const list = searchLists[idx];
    const searchChildren = [];
    list.map((searchTerm , j)=>{
      searchChildren.push(<SearchElementForm key={j} idx = {idx} j= {j} searchTerm = {searchTerm} searchLists = {searchLists} setSearchLists={setSearchLists}/>);
    })
    return searchChildren;
  }

  const searchTermList = generateSearchChildren();
  const defaultSearchTerm = <SearchElementForm key={0} idx = {idx} j = {0} searchTerm = {""} searchLists = {searchLists} setSearchLists={setSearchLists}/>

  const searchElementChildren = searchTermList.length > 0 ? searchTermList : defaultSearchTerm;

  //Event to add a blank searchList to searchLists
  const createNewSearchList = (e) =>{
    e.stopPropagation();

    let newSearchLists = structuredClone(searchLists);
    newSearchLists.push([""]);
    setSearchLists(newSearchLists);
  }

  //Event to delete the search and remove it from the searchLists
  const scrapSearch = (e) => {
    e.stopPropagation();

    let newSearchLists = structuredClone(searchLists);

    //Handle edge case of removing the final custom search
    if(searchLists.length === 1){
      newSearchLists = [[""]];
    } else {
      //Otherwise, in our normal case we remove the current element
      newSearchLists = searchLists.filter((_, index) => index !== idx);
    }

    setSearchLists(newSearchLists);
  }

  return (
    <div className='SearchElement' id = {skillId} >
        <div className='SkillElementHead' onClick={()=>{setDisplay(display === 'block' ? 'none' : 'block')}}>
          <span className='SkillElementImageContainer'>
            <LazyLoadImage className ='SkillElementImage' alt={elementText} src={`./skill-icon-small.png`}/>
          </span>
          <span className='SkillElementText'>
            <span className='SkillElementTextSpan'>
              {elementText}
            </span>
            <span className='SearchButtons'>
              
              <div className='SearchButtonContainer'>
                <button className='AddCustomSearch' onClick={createNewSearchList}>
                  <div>{'+'}</div>
                </button>
              </div>

              <div className='SearchButtonContainer' >
                <button className='DeleteSearchButton' onClick={scrapSearch}>
                  <div>{'🗑'}</div>
                </button>
              </div>
              
            </span>
          </span>
        </div>

        <SubSkillDropDownContainer display={display} id = {skillId} children={searchElementChildren}/>
    </div>
  )
}
