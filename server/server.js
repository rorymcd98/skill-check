const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const {searchDatabase} = require('./search-database.js');



const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.get('/api/v1', (req, res) => {
  res.send('Connected to backend');
});

app.get('/api/v1/data', (req, res)=>{
  searchDatabase('react').then((dbRes)=> {
    console.log(dbRes.rows.length)
    res.send(dbRes)
  });
})

app.listen(3001, () => {
  console.log('Server running on http://localhost:' + PORT);
}); 