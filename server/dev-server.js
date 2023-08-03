const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const { searchDatabaseUnion } = require("./search-database-union.js");
const { searchDatabaseEach } = require("./search-database-each.js");
const {
  createSalaryDistributions,
} = require("./chart-creation/create-salary-distributions.js");
const { createTimeSeries } = require("./chart-creation/create-time-series.js");
const {
  createSkillsFrequency,
} = require("./chart-creation/create-skill-frequency");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/skillcheck/api/v1", (req, res) => {
  res.send("Connected to backend on port: " + PORT);
});

app.get("/skillcheck/api/v1/data", (req, res) => {
  //Collect queries from the SQL database and parse the results
  const queries = [];
  for (q in req.query) {
    queries.push(req.query[q]);
  }

  collectQueries(queries).then((jobQueries) => {
    //Create salary a salary distributions
    const salaryDistributions = createSalaryDistributions(
      jobQueries.unions,
      5000
    );
    const salaryTimeSeries = createTimeSeries(jobQueries.unions);
    const skillsFrequencies = createSkillsFrequency(
      jobQueries.eaches,
      jobQueries.unions
    );

    //Send the collected data (becomes chartData when received by front end)
    res.send({
      salaryDistributions,
      salaryTimeSeries,
      skillsFrequencies,
    });
  });
});

async function collectQueries(termsList) {
  //Parameters for the search
  const rankThreshold = "0.2"; //Search relevance threshold
  const minSalaryLimit = "15000"; //Minimum salary limit (£15 thousand)
  const maxSalaryLimit = "450000"; //Maximum salary limit (£450 thousand)

  const jobQueries = { unions: {}, eaches: {} };

  if (!(termsList instanceof Array)) return [];

  for (terms of termsList) {
    //Search name e.g. 'Javascript (+5)'
    const searchName = `${terms[0]}${
      terms.length > 1 ? ` (+${terms.length - 1})` : ""
    }`;

    //Filter out all the empty terms -> if the array is empty then don't search the database
    terms = terms.filter((term) => {
      return term.length > 0;
    });
    if (terms.length == 0) continue;

    //Union queries e.g. [Javascript UNION React UNION ...]
    const dbUnion = await searchDatabaseUnion(
      terms,
      rankThreshold,
      minSalaryLimit,
      maxSalaryLimit
    );
    jobQueries["unions"][searchName] = dbUnion.rows;

    //Each queries e.g. [Javascript, react, ...]
    const dbEach = await searchDatabaseEach(
      terms,
      rankThreshold,
      minSalaryLimit,
      maxSalaryLimit
    );
    jobQueries["eaches"][searchName] = dbEach;
  }

  return jobQueries;
}

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
