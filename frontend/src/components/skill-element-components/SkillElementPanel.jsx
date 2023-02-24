import React from 'react';
import { useState, useEffect } from 'react';
import '../../../css/SkillElementPanel.css';
import SkillElementContainer from './SkillElementContainer';
import SkillElement from './SkillElement';
import SearchElement from './SearchElement';
import initialSkills from '../component-resources/initialSkills';


export default function SkillElementPanel({skillElementObject, setSkillElementObject, searchLists, setSearchLists, SliderPanelComponent}) {   

    //Toggles all the sub skills of an Element
    function createToggleAll(skillId, selectAllBool){

            function toggleAll(){
                    const newSkillElementObject = structuredClone(skillElementObject);
                    newSkillElementObject[skillId].deselectedSubSkills = !selectAllBool ? [...initialSkills[skillId].deselectedSubSkills] : [];
                    newSkillElementObject[skillId].selectedSubSkills = selectAllBool ? [...initialSkills[skillId].deselectedSubSkills] : [];
                    
                    setSkillElementObject(newSkillElementObject);
            }

            return toggleAll;
    }

    function createToggleSubSkill(skillId, subSkillName, selectBool){

            function toggleSubSkill(){
                    const newSkillElementObject = structuredClone(skillElementObject);
                    const deselectedSubSkills = newSkillElementObject[skillId].deselectedSubSkills;
                    const selectedSubSkills = newSkillElementObject[skillId].selectedSubSkills;

                    const swapElement = (arr1, arr2)=>{
                            const subSkillIndex = arr1.indexOf(subSkillName);
                            arr1.splice(subSkillIndex,1);
                            arr2.push(subSkillName);
                    }

                    if(selectBool){
                            swapElement(deselectedSubSkills, selectedSubSkills);
                    } else {
                            swapElement(selectedSubSkills, deselectedSubSkills);
                    }
                            
                    setSkillElementObject(newSkillElementObject);
            }
            
            return toggleSubSkill;
    }


    //Assemble the object into a list of SkillElement chidlren - this is passed to each SkillElementContainer
    function objectToSkillList(skillElementObject, selectedBool){
            const skillElementList = [];
            Object.keys(skillElementObject).map((skillId)=>{
                    
                    const skill = skillElementObject[skillId];
                    const areSelectedSkills = skill.selectedSubSkills.length > 0 && selectedBool;
                    const aredeselectedSkills = skill.deselectedSubSkills.length > 0 && !selectedBool;

                    //If nothing relevant is selected, don't render this element
                    if (!(areSelectedSkills || aredeselectedSkills)) return;

                    skillElementList.push(<SkillElement key={skillId} skillId={skillId} name={skill.name} onClick={createToggleAll(skillId, !selectedBool)} skillElementObject={skillElementObject} createToggleSubSkill={createToggleSubSkill} selectedBool={selectedBool}/>)
            })

            return skillElementList;
    }

    //Iterate through the searchLists adding a custom search element for each
    const searchElements = [];
    searchLists.map((searchList, idx)=>{

        const idSearchElement = 'search-element-' + idx;
        searchElements.push(<SearchElement key = {idSearchElement} id = {idSearchElement} idx = {idx} searchLists={searchLists} setSearchLists={setSearchLists}/>);
    })
            

    

  const idSelected = 'SkillSelected';
  const idDeselected = 'SkillDeselected';
	const selectedChildren = searchElements.concat(objectToSkillList(skillElementObject, true));
	const deselectedChildren = objectToSkillList(skillElementObject, false);

  const [slideOut, setSlideOut] = useState(true);
  const width = slideOut ? null: '0rem' //null restores default value (~30rem)

  return (
    <span className='SkillElementPanel' style={{width}}>
      <div id='slide-tab' onClick={() => setSlideOut(!slideOut)}></div> 
      <SkillElementContainer  key = {idSelected} id={idSelected} children={selectedChildren} />
      <SkillElementContainer  key = {idDeselected} id={idDeselected} children={deselectedChildren}/>
      {SliderPanelComponent}
    </span>
  )
}
