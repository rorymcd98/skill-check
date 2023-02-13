//Creates time series based on the salary
//jobQueries - Array of jobs query objects from the PostgresQL database
//kernelSize - 1D kernel size in months for averaging results to provide smoothing

function createTimeSeries(jobQueries, kernelSize = 2){
  //Stores scatter points, and average lines for each job query
  const resultObject = {};

  //Iterate through each query -> then each job -> sort into histogram blocks
  for (jobQuery in jobQueries){
    const queryList = jobQueries[jobQuery];
    const averageLineCounter = {}; //Stores the total and the count for a given kernel (to calculate the representative line)
    
    //Plotted data
    const scatterPoints = [];
    const averageLine = [];


    for(jobId in queryList){
      const job = queryList[jobId];

      const jobAverage = job['avg_salary'];

      //Turn the date into a float (e.g. 2021.91)
      const jobDate = job['published_date'];
      const jobDateFloat = dateToFloat(jobDate);
      
      //If there's no associated date then skip
      if (jobDateFloat == null) continue; 

      //Otherwise push a scatter point
      scatterPoints.push({x: jobDateFloat, y:jobAverage})

      //Assign the jobDateFloat to the nearest kernel that it belongs to
      const kernel = (12/kernelSize);
      const jobDateKernel = Math.round(jobDateFloat*kernel)/kernel;
      
      if(averageLineCounter[jobDateKernel]){
        averageLineCounter[jobDateKernel].counter++;
        averageLineCounter[jobDateKernel].total+=jobAverage;
      } else {
        averageLineCounter[jobDateKernel] = {
          counter: 1,
          total: jobAverage
        }
      }
    }

    //Turn the averageLineCounter into a line
    for(dateKernel in averageLineCounter){
      const kernelVal = averageLineCounter[dateKernel];
      const lineValue = kernelVal.total/kernelVal.counter;
      averageLine.push({x: dateKernel, y:lineValue})
    }

    resultObject[jobQuery] = {
      scatterPoints,
      averageLine
    }

  }

  return resultObject;
}

//Converts date from ISO 8601 to a float based on the year
//date format: 2022-11-21T00:00:00.000Z
//dateFloat format: 2022.916666
function dateToFloat(date){
  if(!(date instanceof Date)) return null;

  const dateFloat = date.getFullYear() + date.getMonth()/12 + date.getDay()/365;

  return dateFloat;
}


module.exports = {createTimeSeries};

// Should return:
  // average timeseries
  // max timeseries
  // min timeseries
  // scatter dots