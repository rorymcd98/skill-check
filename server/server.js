const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const {searchDatabase} = require('./search-database.js');
const {createSalaryHistograms} = require('./create-salary-histograms.js')
const {createTimeSeries} = require('./create-time-series.js')

console.log(createTimeSeries)


const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.get('/api/v1', (req, res) => {
  res.send('Connected to backend on port: ' + PORT);
});

app.get('/api/v1/data', (req, res)=>{
  //Collect queries from the SQL database and parse the results
  console.log(req.query)
  const queries = [];
  for(q in req.query){
    queries.push(req.query[q]);
  }


  collectQueries(queries).then((jobQueries)=>{
    //Create salary a salary histograms
    const salaryHistograms = createSalaryHistograms(jobQueries, 5000);
    const salaryTimeSeries = createTimeSeries(jobQueries, 1);

    //Send the collected data (becomes chartData when received by front end)
    res.send({
      salaryHistograms,
      salaryTimeSeries
    });

  })
})

async function collectQueries(termsList) {
  const jobQueries = {};

  if (!(termsList instanceof Array)) return []; 

  for (terms of termsList) {
    const dbRes = await searchDatabase(terms);
    jobQueries[`${terms[0]}${terms.length>1 ? ` (+${terms.length -1})` : ''}`] = dbRes.rows;
  }

  return jobQueries;
}

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
}); 