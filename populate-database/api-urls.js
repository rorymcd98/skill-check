const axios = require("axios"); //Promise based HTTP requests
const { saveToFile, loadFromFile } = require("./store-json"); //Helper functions for saving and loading
const pLimit = require("p-limit"); //'Pooling' for get requests - only a few requests at a time
require("dotenv").config({ path: __dirname + "../../.env" }); //dotenv - used for API_KEY (reed API key)

main("software", "software");

async function main(searchTerm, saveWord) {
  let saveObj = loadFromFile(saveWord); //Returns past search results (or an empty object if one doesn't exist)

  //If a new file is loaded, create a default save object with metadata and results
  if (saveObj.results === undefined) {
    saveObj.results = {};
  }
  if (saveObj.meta === undefined) {
    saveObj.meta = {};
  }
  if (saveObj.meta.searchTerm === undefined) {
    saveObj.meta.searchTerm = searchTerm;
  }
  if (saveObj.meta.descriptionSeen === undefined) {
    saveObj.meta.descriptionSeen = {};
  }

  //Figure out how many results we have -> how many pages to search (results/100)
  let searchLength;
  try {
    const pageZeroRes = await resultsForPage(0, searchTerm);
    searchLength = pageZeroRes.response.data.totalResults;
    console.log(
      "Number of listings: ",
      searchLength,
      "\nAdding new listings..."
    );
  } catch {
    console.log("couldn't fetch page 0");
    return;
  }

  //Create the page promises (limited to 10 promises at a time)
  const limit = pLimit(10);
  const pagePromises = [];

  for (let i = 0; i < searchLength / 100; i++) {
    pagePromises.push(limit(() => resultsForPage(i, searchTerm))); // Use p-limit to limit the number of concurrent search promises
  }

  let pageResults = [];
  pageResults = await Promise.all(pagePromises);

  // Save the successfully resolved promises to saveObj
  for (let i = 0; i < pageResults.length; i++) {
    const pageResult = pageResults[i];
    if (pageResult === undefined) continue;

    //curObj - 100 job listings which need to be stored
    const curObj = pageResult.response.data.results;

    for (const key in curObj) {
      const jobId = curObj[key].jobId;

      //If the job listing hasn't been saved before, save it
      if (saveObj.results[jobId] === undefined) {
        saveObj.results[jobId] = curObj[key];
      }

      //Add a search terms object if it doesn't exist (stores all searches to see if another search generated this listing)
      if (saveObj.results[jobId].searchTerms === undefined) {
        saveObj.results[jobId].searchTerms = {};
      }

      saveObj.results[jobId].searchTerms[searchTerm] = true;
    }
  }

  saveToFile(saveObj, saveWord);
}

//Returns a list (of 100) job listings at pageNum for a given searchTerm
async function resultsForPage(pageNum, searchTerm) {
  const qry = {
    versionNum: "1.0",
    searchTerm: encodeURIComponent(searchTerm),
    locationName: encodeURIComponent("UK"),
  };

  const url = `https://www.reed.co.uk/api/${qry.versionNum}/search?keywords=${
    qry.searchTerm
  }&locationName=${qry.locationName}&resultsToSkip=${(
    100 * pageNum
  ).toString()}`;
  const token = Buffer.from(`${process.env.API_KEY}:`, "utf8").toString(
    "base64"
  );

  const headers = {
    Authorization: `Basic ${token}`,
    "Accept-Encoding": "application/json",
  };
  try {
    const response = await axios.get(url, { headers });
    console.log("Loaded: " + url);
    return { response, pageNum };
  } catch (error) {
    console.error(error);
  }
}
