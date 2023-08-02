const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Client } = require("pg");

//Searches for the COUNT of each individual searchTerm
async function searchDatabaseEach(
  searchTerms,
  rankThreshold,
  minSalaryLimit,
  maxSalaryLimit,
  clientParams
) {
  //Client object depen
  const client = new Client(clientParams);

  try {
    await client.connect();
    console.log("Connected to db.");
  } catch (err) {
    console.log("Error connectint to db.", err);
  }

  const searchQuery = assembleQuery(
    searchTerms,
    rankThreshold,
    minSalaryLimit,
    maxSalaryLimit
  );

  try {
    const res = await client
      .query(searchQuery)
      .then(console.log("Successful query!"));

    await client.end();
    return res;
  } catch (err) {
    console.error(err);
    console.log("Query error!");

    await client.end();
    return { rows: [] };
  }
}
// Dev note: This is really bad code, why am I using 'i' to index an object? I can get SQL injected about 100 different ways here. I should be using a prepared statement. I should be using a library to do this for me. I should be using a different language. I should be using a different database. I should be using a different computer. I should be using a different planet. I should be using a different universe. I should be using a different dimension. I should be using a different timeline. I should be using a different reality. I should be using a different existence!
// Ok co-pilot wrote the rest of the prior line, what a journey.

//Accepts an array of search terms, and returns a query which selects the UNION of all the search terms
function assembleQuery(
  searchTerms,
  rankThreshold,
  minSalaryLimit,
  maxSalaryLimit
) {
  const subQueryArray = [];

  for (i in searchTerms) {
    let searchTerm = searchTerms[i];
    searchTerm = searchTerm.trim();
    if (searchTerm.length == 0) continue;

    //Count the number of rows where a search term matches the job description and title (represented in search_vector)
    const subQuery = `COUNT(*) FILTER (WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold} 
                          AND (minimum_salary + maximum_salary) / 2 BETWEEN ${minSalaryLimit} AND ${maxSalaryLimit}) as "${searchTerm}"`;

    subQueryArray.push(subQuery);
  }

  if (subQueryArray.length == 0) {
    console.error("No valid search terms. (search-database.js)");
    return null;
  }

  //Join and wrap the subqueries in a SELECT query
  const joinedQueries = subQueryArray.join(", \n");
  const searchQuery = "SELECT " + joinedQueries + " FROM job_listing;";

  return searchQuery;
}

module.exports = { searchDatabaseEach };
