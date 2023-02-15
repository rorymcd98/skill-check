//Creates histograms based on the salary
//jobQueries - Array of jobs query objects from the PostgresQL database
//blockSize - Determines number of histograms block sizes (£)
function createSalaryHistograms(jobQueries, blockSize = 5000){

  //Create the block lists for each search
  const resultObject = {
    'histograms':{},
    'histogramLabels': []
  };

  //Used to determine how long the labels list should be
  let maximumLength = 0;

  //Iterate through each query -> then each job -> sort into histogram blocks
  for (jobQuery in jobQueries){
    const blockList = [];
    const queryList = jobQueries[jobQuery];
    for(jobId in queryList){
      const job = queryList[jobId];

      const jobSalary = job['avg_salary'];
      const blockIndex = Math.floor(jobSalary / blockSize);
      blockList[blockIndex] = (blockList[blockIndex] || 0) + 1;

    }

    maximumLength = Math.max(maximumLength, blockList.length)

    //Normalize the histogram by the total number of jobs searched (turning it into a 'distribution')
    for(i in blockList){
      blockList[i] /= queryList.length;
    }

    resultObject['histograms'][jobQuery] = blockList;
  }

  
  

  //Generate the labels
  const histogramLabels = [];
  for(i=0; i<maximumLength; i++){
    histogramLabels.push(`£${i*blockSize/1000}k`);
  }

  resultObject['histogramLabels'] = histogramLabels;

  return resultObject;
}



module.exports = {createSalaryHistograms};