This directory populates an SQL database with job postings from Reed.

Instructions:
1) node api-urls.js (Generates a list of job - minimal information - includes respective URLs)
2) node scrape-postings.js (Populates the job list with full descriptions)
3) node populate-sql.js (Transfers json object into PostgreSQL database)