//Return a sorted array of counts for each subSkill given the EACH job query
function createSkillsFrequency(jobQueriesEaches, jobQueriesUnions){

  const resultObject = {
    'labels': {},
    'counts': {}
  }
  
  Object.keys(jobQueriesEaches).map((jobQuery)=>{
    const queryResult = jobQueriesEaches[jobQuery];
    const unionResult = jobQueriesUnions[jobQuery];
    
    //Create the total (first) element of the results
    const totalCount = [Object.keys(unionResult).length];
    const totalLabel = ['Total'];

    //Only add to the results if a query has been found
    if(queryResult.rows.length > 0){
      const {sortedLabels, sortedCounts} = sortObject(queryResult.rows[0]);
      resultObject.labels[jobQuery] = totalLabel.concat(sortedLabels);
      resultObject.counts[jobQuery] = totalCount.concat(sortedCounts);
    } 
  })

  return resultObject;
}

function sortObject(obj) {
  let keys = Object.keys(obj);
  let values = Object.values(obj);
  let sortedCounts = values.sort((a,b) => b-a);
  let sortedLabels = [];
  //Horrendously inefficient double loop
  for(let i=0; i<sortedCounts.length; i++) {
      for(let j=0; j<values.length; j++) {
        if(sortedCounts[i] === values[j]) {
          sortedLabels[i] = keys[j];
      }
    }
  }

  for(i in sortedCounts){
    sortedCounts[i] = Number(sortedCounts[i])
  }
  return {sortedLabels, sortedCounts};
}

module.exports = {createSkillsFrequency};