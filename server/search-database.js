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
    const rankThreshold = '0.2';
    const searchQuery = `SELECT job_title, minimum_salary, maximum_salary, ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) as rank
    FROM job_listing
    WHERE ts_rank(search_vector, websearch_to_tsquery('${searchTerm}')) >= ${rankThreshold}
    ORDER BY rank DESC;`

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