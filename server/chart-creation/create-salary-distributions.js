//Creates distributions based on the salary
//jobQueriesUnions - Array of UNION jobs query objects from the PostgresQL database
//blockSize - Determines number of distributions block sizes (£)
function createSalaryDistributions(jobQueriesUnions, blockSize = 5000){

  //Create the block lists for each search
  const resultObject = {
    'distributions':{},
    'distributionLabels': []
  };

  //Used to determine how long the labels list should be
  let maximumLength = 0;

  //Iterate through each query -> then each job -> sort into distribution blocks
  for (jobQuery in jobQueriesUnions){
    const blockList = [];
    const queryList = jobQueriesUnions[jobQuery];
    for(jobId in queryList){
      const job = queryList[jobId];

      const jobSalary = job['avg_salary'];
      const blockIndex = Math.floor(jobSalary / blockSize);
      blockList[blockIndex] = (blockList[blockIndex] || 0) + 1;

    }

    maximumLength = Math.max(maximumLength, blockList.length)

    //Normalize the distribution by the total number of jobs searched (turning it into a 'distribution')
    for(i in blockList){
      blockList[i] /= queryList.length;
    }

    if(blockList.length > 0){
      resultObject['distributions'][jobQuery] = blockList;
    }
  }

  
  

  //Generate the labels
  const distributionLabels = [];
  for(i=0; i<maximumLength; i++){
    distributionLabels.push(`£${i*blockSize/1000}k`);
  }

  resultObject['distributionLabels'] = distributionLabels;

  return resultObject;
}



module.exports = {createSalaryDistributions};