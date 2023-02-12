require('dotenv').config({ path: __dirname + '../../.env' });
const { Client } = require('pg');


async function searchDatabase(searchTerm){
    const client = new Client();
    try {
        await client.connect();
        console.log("Connected to db.")
    } catch (err) {
        console.log("Error connectint to db.", err)
    }
    const rankThreshold = '0.2'; //Search relevance threshold
    const maxSalaryLimit = '450000'; //Maximum salary limit (450 thousand)
    const minSalaryLimit = '15000'; //Minimum salary limit (15 thousand)

    const searchQuery = `SELECT job_title, minimum_salary, maximum_salary,
        ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) as rank,
        (minimum_salary + maximum_salary) / 2 as avg_salary
        FROM job_listing
        WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold}
        AND (minimum_salary + maximum_salary) / 2 BETWEEN ${minSalaryLimit} AND ${maxSalaryLimit}
        ORDER BY avg_salary ASC;`

    try {
        const res = await client.query(searchQuery).then(console.log('Successful query!'));
        
        return res;
    } catch (err) {
        console.error(err)
        console.log('Query error!')
    }

    await client.end();
}

module.exports = {searchDatabase};