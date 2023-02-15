require('dotenv').config({ path: __dirname + '../../.env' });
const { Client } = require('pg');

//Searches for the UNION of all searchTerms 
async function searchDatabaseUnion(searchTerms){
    const client = new Client();
    try {
        await client.connect();
        console.log("Connected to db.")
    } catch (err) {
        console.log("Error connectint to db.", err)
    }

    const searchQuery = assembleQuery(searchTerms);

    try {
        const res = await client.query(searchQuery).then(console.log('Successful query!'));
        
        return res;
    } catch (err) {
        console.error(err)
        console.log('Query error!')
        return {'rows': []}
    }

    await client.end();
}

//Accepts an array of search terms, and returns a query which selects the UNION of all the search terms
function assembleQuery(searchTerms){

    const rankThreshold = '0.2'; //Search relevance threshold
    const maxSalaryLimit = '450000'; //Maximum salary limit (£450 thousand)
    const minSalaryLimit = '15000'; //Minimum salary limit (£15 thousand)

    const subQueryArray = [];

    //Iterate through the search terms, create a SELECT query for each
    for (i in searchTerms){
        let searchTerm = searchTerms[i];
        searchTerm = searchTerm.trim();
        if(searchTerm.length == 0) continue;

        const subQuery = `SELECT job_title, minimum_salary, maximum_salary, published_date,
        ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) as rank,
        (minimum_salary + maximum_salary) / 2 as avg_salary
        FROM job_listing
        WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold}
        AND (minimum_salary + maximum_salary) / 2 BETWEEN ${minSalaryLimit} AND ${maxSalaryLimit}`
        
        subQueryArray.push(subQuery);
    }

    if(subQueryArray.length == 0) {console.error('No valid search terms. (search-database.js)'); return null}

    //Join queries with UNION
    const joinedQueries = subQueryArray.join(') UNION (');
    
    //Sort by published_date
    const searchQuery = '(' + joinedQueries + ') ORDER BY published_date ASC;'

    return searchQuery;

}


module.exports = {searchDatabaseUnion};