const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const {searchDatabase} = require('./search-database.js');
const {createSalaryHistograms} = require('./data-analaysis.js')


const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.get('/api/v1', (req, res) => {
  res.send('Connected to backend on port: ' + PORT);
});

app.get('/api/v1/data', (req, res)=>{

  collectQueries(['python', 'javascript']).then((jobQueries)=>{
    //Create salary a salary histograms
    const salaryHistograms = createSalaryHistograms(jobQueries, 5000);
  
    res.send({
      'salaryHistograms' : salaryHistograms
    });

  })
})

async function collectQueries(termsList) {
  const jobQueries = {};

  for (term of termsList) {
    const dbRes = await searchDatabase(term);
    jobQueries[term] = dbRes.rows;
  }

  return jobQueries;
}

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
}); 