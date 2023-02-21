require('dotenv').config({ path: __dirname + '../../.env' });
const { Client } = require('pg');

//Searches for the COUNT of each individual searchTerm
async function searchDatabaseEach(searchTerms, rankThreshold, minSalaryLimit, maxSalaryLimit){
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
        // user: process.env.PGUSER,
        // host: process.env.PGHOST,
        // database: 'skillcheck',
        // password: process.env.PGPASSWORD,
        // port: process.env.PGPORT,
      });
    try {
        await client.connect();
        console.log("Connected to db.")
    } catch (err) {
        console.log("Error connectint to db.", err)
    }

    const searchQuery = assembleQuery(searchTerms, rankThreshold, minSalaryLimit, maxSalaryLimit);

    try {
        const res = await client.query(searchQuery).then(console.log('Successful query!'));
        
        await client.end();   
        return res;
    } catch (err) {
        console.error(err)
        console.log('Query error!')

        await client.end();
        return {'rows': []}
    }
}

//Accepts an array of search terms, and returns a query which selects the UNION of all the search terms
function assembleQuery(searchTerms, rankThreshold, minSalaryLimit, maxSalaryLimit){
    const subQueryArray = [];

    for (i in searchTerms){
        let searchTerm = searchTerms[i];
        searchTerm = searchTerm.trim();
        if(searchTerm.length == 0) continue;

        //Count the number of rows where a search term matches the job description and title (represented in search_vector) 
        const subQuery = `COUNT(*) FILTER (WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold} 
                          AND (minimum_salary + maximum_salary) / 2 BETWEEN ${minSalaryLimit} AND ${maxSalaryLimit}) as "${searchTerm}"`
        
        subQueryArray.push(subQuery);
    }

    if(subQueryArray.length == 0) {console.error('No valid search terms. (search-database.js)'); return null}

    //Join and wrap the subqueries in a SELECT query
    const joinedQueries = subQueryArray.join(', \n');
    const searchQuery = 'SELECT ' + joinedQueries + ' FROM job_listing;'

    return searchQuery
}


module.exports = {searchDatabaseEach};