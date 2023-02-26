A single page application for visualising the market value of software skills.


<h1 align="center">Skill Check</h1>

> A single page application for visualising the market value of software skills.

Available at [skill-check.herokuapp.com](https://skill-check.herokuapp.com/)

<h2>Preview</h2> 

![text](image.png)

<h2>Features</h2> 

- Visualisations of the number of salary distributions, number of jobs, and salary trends for job skills
- Ability to quickly select a number of pre-existing search queries, or to easily assemble new queries

Utilises: 

- A React frontend with annotated components
- PostgreSQL database, populated from the Reed job search API, in combination with Cheerio webscraping
- Hosts a RESTful API (using Express) to allow the client to dynamically and easily query the database for job skills
- Bundled with Vite for production and development with hot module replacement
- Specific frontend features include: Chart JS, lazy image loading, and reponsive design for desktop, mobile, tablet etc.

<h2></h2>

<h2>Instructions:</h2> 

<h3>Hosting</h3>

* Install Node.js

* Clone this repoistory 

* Install: `npm install .`

* For production run:

```
npm run build
npm run start
```

* For development run (in separate terminals):

```
npm run dev
npm run start
```

* Open your browser and visit http://localhost:3001/ (or your environment's specified port)

<h3>Database pipeline (local)<h3/>

* Install PostgreSQL

* Create a database called `skillcheck`

* Set the `.env` variables (see below)

* Execute the scripts from populate-database (future versions will automate this):

1. node /populate-database/api-urls.js

2. node /populate-database/scrape-urls.js

3. node /populate-database/store-json.js


<h2>.ENV</h2>

The following env variables are required for hosting

```
PGHOST=localhost
PGUSER=postgres
PGDATABASE=skillcheck
PGPASSWORD=[your postgres password]
PGPORT=5432
```

And for accessing the Reed API

`API_KEY=[your reed API key]`