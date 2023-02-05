import React from 'react';
import { useState, useEffect } from 'react';
import '../../css/SkillElementPanel.css';
import SkillElementContainer from './SkillElementContainer';
import SkillElement from './SkillElement';
import SearchElement from './SearchElement';
import initialSkills from '../../public/initialSkills';


export default function SkillElementPanel() {   
    //Load local storage if available
    const localSkillElementObject = localStorage.getItem("storedSkillElementObject");
    let initialSkillElementObject =  localSkillElementObject ? JSON.parse(localSkillElementObject) : initialSkills;

    const [skillElementObject, setSkillElementObject] = useState(initialSkillElementObject)  

    //Set local storage when skills are selected
    useEffect(()=>{
    localStorage.setItem("storedSkillElementObject", JSON.stringify(skillElementObject))
    }, [skillElementObject])



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

    const idSearchElement = 'search-element';
    const searchElement = [<SearchElement key = {idSearchElement} id = {idSearchElement}/>];

  const idSelected = 'SkillSelected';
  const idDeselected = 'SkillDeselected';
	const selectedChildren = searchElement.concat(objectToSkillList(skillElementObject, true));
	const deselectedChildren = objectToSkillList(skillElementObject, false);


  return (
    <span className='SkillElementPanel'>
      <SkillElementContainer  key = {idSelected} id={idSelected} children={selectedChildren} />
      <SkillElementContainer  key = {idDeselected} id={idDeselected} children={deselectedChildren}/>
    </span>
  )
}
