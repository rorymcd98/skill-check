const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const {searchDatabaseUnion} = require('./search-database-union.js');
const {searchDatabaseEach} = require('./search-database-each.js');
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
    const salaryHistograms = createSalaryHistograms(jobQueries.unions, 5000);
    const salaryTimeSeries = createTimeSeries(jobQueries.unions, 1);

    //Send the collected data (becomes chartData when received by front end)
    res.send({
      salaryHistograms,
      salaryTimeSeries
    });

  })
})

async function collectQueries(termsList) {
  const jobQueries = {'unions': {},
                      'eaches': {}};

  if (!(termsList instanceof Array)) return []; 

  for (terms of termsList) {
    const dbUnion = await searchDatabaseUnion(terms);
    jobQueries['unions'][`${terms[0]}${terms.length>1 ? ` (+${terms.length -1})` : ''}`] = dbUnion.rows;
  }

  return jobQueries;
}

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
}); 