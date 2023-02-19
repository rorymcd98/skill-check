//Creates time series based on the salary
//jobQueriesUnions - Array of jobs query objects from the PostgresQL database
//skip - Skip every scatter
function createTimeSeries(jobQueriesUnions, skip=7){
  //Stores scatter points, and average lines for each job query
  const resultObject = {};

  //Iterate through each query -> then each job -> sort into distribution blocks
  for (jobQuery in jobQueriesUnions){
    const queryList = jobQueriesUnions[jobQuery];
    const averageLineCounter = {}; //Stores the total and the count for a given kernel (to calculate the representative line)
    
    //Plotted data
    const scatterPoints = [];
    const averageLine = [];


    //Track a job when the skip counter is a multiple of skip
    let skipCounter = 0;

    for(jobId in queryList){
      const job = queryList[jobId];
      
      //Add relevant info to scatter points
      const jobDate = job['published_date'];
      const jobAverage = job['avg_salary'];
      const jobTitle = job['job_title'];
      const url = job['job_url'];


      if(skipCounter%skip == 0){
        scatterPoints.push({x: jobDate, y:jobAverage, label:jobTitle, url})
      }
      skipCounter++;

      //Store the average line
      const roundedDate = roundDateToMonth(jobDate);
      const dateKey = roundedDate.toString();
      if(averageLineCounter[dateKey]){
        averageLineCounter[dateKey].counter++;
        averageLineCounter[dateKey].total+=jobAverage;
        averageLineCounter[dateKey].dateObject = roundedDate;
      } else {
        averageLineCounter[dateKey] = {
          counter: 1,
          total: jobAverage
        }
      }
    }

    //Turn the averageLineCounter into a line
    for(dateKey in averageLineCounter){
      const month = averageLineCounter[dateKey];
      const linePointVal = month.total/month.counter;

      averageLine.push({x: averageLineCounter[dateKey].dateObject, y:linePointVal})
    }

    if(scatterPoints.length > 0){
      resultObject[jobQuery] = {
        scatterPoints,
        averageLine
      }
    }
  }

  return resultObject;
}

//Returns a date object to nearest month
function roundDateToMonth(date){
  if(!(date instanceof Date)) return null;

  const roundedDate = new Date(date.getFullYear(), date.getMonth(), 0);

  return roundedDate;
}

module.exports = {createTimeSeries};
