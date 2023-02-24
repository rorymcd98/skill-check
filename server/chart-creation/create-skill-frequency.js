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
    const totalLabel = ['All'];

    //Only add to the results if a query has been found
    if(queryResult.rows.length > 0){
      const {sortedKeys: sortedLabels, sortedValues: sortedCounts} = sortObject(queryResult.rows[0]);
      resultObject.labels[jobQuery] = totalLabel.concat(sortedLabels);
      resultObject.counts[jobQuery] = totalCount.concat(sortedCounts);
    } 
  })

  return resultObject;
}

function sortObject(obj) {
  const sortedKeyValPairs = Object.entries(obj).sort(
    ([_kA, valA], [_kB, valB]) => {
      if (Number(valA) < Number(valB)) return 1;
      else return -1;
    }
  );

  return {
    sortedKeys: sortedKeyValPairs.map(([key]) => key),
    sortedValues: sortedKeyValPairs.map(([_, val]) => val)
  };
}

module.exports = {createSkillsFrequency};