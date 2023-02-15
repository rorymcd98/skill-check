require('dotenv').config({ path: __dirname + '../../.env' });
const { Client } = require('pg');

//Searches for the COUNT of each individual searchTerm
async function searchDatabaseEach(searchTerms){
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

    for (i in searchTerms){
        let searchTerm = searchTerms[i];
        searchTerm = searchTerm.trim();
        if(searchTerm.length == 0) continue;

        const subQuery = `COUNT(*) FILTER (WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold} 
                          AND (minimum_salary + maximum_salary) / 2 BETWEEN ${maxSalaryLimit} AND ${minSalaryLimit}) as ${searchTerm}`
        
        subQueryArray.push(subQuery);
    }

    if(subQueryArray.length == 0) {console.error('No valid search terms. (search-database.js)'); return null}

    const joinedQueries = subQueryArray.join(',');

    const searchQuery = 'SELECT' + joinedQueries + 'FROM job_listing;'

    return searchQuery
}


module.exports = {searchDatabaseEach};