//Creates a histograms based on the salary
//jobs - jobs object from the PostgresQL database
//splitPoint - interpolation point for (minimum_salary, maximum_salary)

//blockSize - determines number of histograms block sizes
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