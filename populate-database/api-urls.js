const axios = require('axios');                                 //Promise based HTTP requests
const { saveToFile, loadFromFile } = require('./store-json');   //Helper functions for saving and loading
const pLimit = require('p-limit');                              //'Pooling' for get requests - only a few requests at a time
require('dotenv').config({ path: __dirname + '../../.env' });   //dotenv - used for API_KEY (reed API key)

main('software engineer', 'software');

async function main(searchTerm, saveWord) {
  const limit = pLimit(5); // Limit the number of concurrent search promises to 5

  let saveObj = loadFromFile(saveWord); //Returns past search results (or an empty object if one doesn't exist) 

  //If a new file is loaded, create a default save object with metadata and results
  if (saveObj.meta === undefined) {
    saveObj.results = {}
    saveObj.meta = {
      searchTerm,
      seen: {},
    };
  }


  //Figure out how many results we have -> how many pages to search (results/100)
  let searchLength;
  try {
    const pageZeroRes = await resultsForPage(0, searchTerm);
    searchLength = pageZeroRes.response.data.totalResults;
    console.log(searchLength);
  } catch {
    console.log("couldn't fetch page 0");
    return;
  }

  //Create the page promises (limited to 5 promises at a time)
  const pagePromises = [];
  for(let i = 0; i<searchLength/100; i++){
    if (i in Object.keys(saveObj.meta.seen)) {//Skip the promise if it's already in the save object
      continue;
    }
    pagePromises.push(limit(() => resultsForPage(i, searchTerm))); // Use p-limit to limit the number of concurrent search promises
  }

  let pageResults = [];
  pageResults = await Promise.all(pagePromises);

  // Save the successfully resolved promises to saveObj
  for (let i = 0; i < pageResults.length; i++) {
    const pageResult = pageResults[i];
    if (pageResult === undefined) continue;
    const curObj = pageResult.response.data.results;
    const pageNum = pageResults[i].pageNum;
    saveObj.meta.seen[pageNum] = true;
    for (const key in curObj) {
      const jobId = curObj[key].jobId;
      if (saveObj.results[jobId] === undefined) {
        saveObj.results[jobId] = curObj[key];
      } else {
        saveObj.results[jobId].searchTerms[searchTerm] = true;
      }
    }
  }

  saveToFile(saveObj, saveWord);
}

//Returns a list (of 100) job listings at pageNum for a given searchTerm
//Resolved as a promise in main()
async function resultsForPage(pageNum, searchTerm){
    const qry = {
        versionNum: '1.0',
        searchTerm: encodeURIComponent(searchTerm),
        locationName : encodeURIComponent("UK"),
    }

    const url = `https://www.reed.co.uk/api/${qry.versionNum}/search?keywords=${qry.searchTerm}&locationName=${qry.locationName}&resultsToSkip=${(100*pageNum).toString()}`
    const token = Buffer.from(`${process.env.API_KEY}:`, 'utf8').toString('base64');

    const headers = {
        'Authorization': `Basic ${token}`,
        'Accept-Encoding': 'application/json'
    }
    try{
        const response = await axios.get(url, {headers});
        console.log("Loaded: " + url)
        return {response, pageNum};
    } catch (error) {
        console.error(error);
    } 
}