import React, { useState } from 'react'
import { useEffect } from 'react';
import SearchElementForm from './SearchElementForm';
import SubSkillDropDownContainer from './SubSkillDropDownContainer';

export default function SearchElement({skillId, searchList, setSearchList}) {
  //Controls display of 'SubSkillDropDownContainer' and the drop down arrow
  const [display, setDisplay] = useState('block');
  const elementText = 'Search'

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
    <div className='SearchElement' id = {skillId} >
        <div className='SkillElementHead' onClick={()=>{setDisplay(display === 'block' ? 'none' : 'block')}}>
          <span className='SkillElementImageContainer'>
            <img className ='SkillElementImage' alt={elementText} src={`./skill-icon-small.png`}/>
          </span>
          <span className='SkillElementText'>
            <span className='SkillElementTextSpan'>
              {elementText}
            </span>
            <span className='ArrowAndButtonContainer'>
              <div className='SkillElementArrow'>
                {display === 'none' ? 'ᐳ' : 'ᐯ'}
              </div>
              <div className='SelectAllButtonContainer'>
                <button className='SelectAllButton' onClick={(e)=>{e.stopPropagation() ; setSearchList([''])}}>
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
