const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Client } = require("pg");

//Searches for the UNION of all searchTerms
async function searchDatabaseUnion(
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

//Accepts an array of search terms, and returns a query which selects the UNION of all the search terms
function assembleQuery(
  searchTerms,
  rankThreshold,
  minSalaryLimit,
  maxSalaryLimit
) {
  const subQueryArray = [];

  //Iterate through the search terms, create a SELECT query for each
  for (i in searchTerms) {
    let searchTerm = searchTerms[i];
    searchTerm = searchTerm.trim();
    if (searchTerm.length == 0) continue;

    //Select all job posts where a search term matches the job description and title (represented in search_vector)
    const subQuery = `SELECT job_title, job_url, minimum_salary, maximum_salary, published_date,
        ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) as rank,
        (minimum_salary + maximum_salary) / 2 as avg_salary
        FROM job_listing
        WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold}
        AND (minimum_salary + maximum_salary) / 2 BETWEEN ${minSalaryLimit} AND ${maxSalaryLimit}`;

    subQueryArray.push(subQuery);
  }

  if (subQueryArray.length == 0) {
    console.error("No valid search terms. (search-database.js)");
    return null;
  }

  //Join queries with UNION
  const joinedQueries = subQueryArray.join(") UNION (");

  //Sort by published_date
  const searchQuery = "(" + joinedQueries + ") ORDER BY published_date ASC;";

  return searchQuery;
}

module.exports = { searchDatabaseUnion };
