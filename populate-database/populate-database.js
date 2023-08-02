const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Client } = require("pg");
const { loadFromFile } = require("./store-json");

async function populatePostgresDatabase(loadWord) {
  const client = new Client();
  try {
    await client.connect();
    console.log("Connected to db.");
  } catch (err) {
    console.log("Error connectint to db.", err);
  }

  const loadedListingObject = loadFromFile(loadWord);
  const listings = loadedListingObject.results;

  const baseSqlQuery = `
  SET datestyle = dmy;
  CREATE TABLE IF NOT EXISTS job_listing (
        job_id INTEGER PRIMARY KEY,
        employer_name VARCHAR(255),
        job_title VARCHAR(255),
        location_name VARCHAR(255),
        minimum_salary INTEGER,
        maximum_salary INTEGER,
        currency VARCHAR(255),
        published_date DATE,
        job_description TEXT,
        applications INTEGER,
        job_url VARCHAR(255),
        search_vector tsvector
    );
    
    CREATE INDEX IF NOT EXISTS ix_search_vector ON job_listing USING GIN (search_vector);

    CREATE OR REPLACE FUNCTION update_job_listing() RETURNS trigger AS $$
    BEGIN
        new.search_vector := setweight(to_tsvector(coalesce(new.job_title, '')), 'A') ||
            setweight(to_tsvector(coalesce(new.job_description, '')), 'B');
        return new;
    END
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION update_job_content() RETURNS trigger AS $$
    BEGIN
      new.search_vector := setweight(to_tsvector(coalesce(new.job_title, '')), 'A') ||
          setweight(to_tsvector(coalesce(new.job_description, '')), 'B');
      return new;
    END
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS job_search_vector_update ON job_listing;

    CREATE TRIGGER job_search_vector_update
    BEFORE INSERT OR UPDATE
    ON job_listing
    FOR EACH ROW EXECUTE PROCEDURE update_job_content();
    `;

  let sqlQuery = baseSqlQuery;

  for (jobId in listings) {
    const lst = listings[jobId];

    let {
      employerName,
      jobTitle,
      locationName,
      minimumSalary,
      maximumSalary,
      currency,
      date,
      jobDescription,
      applications,
      jobUrl,
    } = lst;

    //Treat edge cases
    //Turn empty salaries into integers (-1)
    minimumSalary = minimumSalary ? minimumSalary : -1;
    maximumSalary = maximumSalary ? maximumSalary : -1;
    //Remove apostrophes as these can cause issues with sql queries
    employerName = deApostrophe(employerName);
    locationName = deApostrophe(locationName);
    jobTitle = deApostrophe(jobTitle);
    jobDescription = deApostrophe(jobDescription);

    // Use template literals to build the INSERT statement
    const insertSqlQuery = `INSERT INTO job_listing (job_id, employer_name, job_title, location_name, minimum_salary, maximum_salary, currency, published_date, job_description, applications, job_url) VALUES (${parseInt(
      jobId
    )}, '${employerName}', '${jobTitle}', '${locationName}', ${minimumSalary}, ${maximumSalary}, '${currency}', '${date}', '${jobDescription}', ${applications}, '${jobUrl}') ON CONFLICT (job_id) DO UPDATE SET employer_name='${employerName}', job_title='${jobTitle}', location_name='${locationName}', minimum_salary=${minimumSalary}, maximum_salary=${maximumSalary}, currency='${currency}', published_date='${date}', job_description='${jobDescription}', applications=${applications}, job_url='${jobUrl}'; `;
    sqlQuery += insertSqlQuery;
  }

  try {
    const res = await client.query(sqlQuery);
    console.log(res);
    console.log("Successful query!");
  } catch (err) {
    console.error(err);
    console.log("Query error!");
  }

  await client.end();
}
module.exports.default = populatePostgresDatabase;
function deApostrophe(string) {
  if (typeof string == "string") {
    return string.replace(/'/g, "");
  }
}
