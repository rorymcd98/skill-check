This directory populates an SQL database with job postings from Reed (specifically for the search term ()).

Instructions:
1) node api-urls.js (Generates a list of job - minimal information - includes respective URLs)
2) node scrape-postings.js (Populates the job list with full descriptions)
3) node populate-database.js (Transfers json object into PostgreSQL database)