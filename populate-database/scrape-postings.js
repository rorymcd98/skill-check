const axios = require("axios");
const cheerio = require("cheerio");
const { saveToFile, loadFromFile } = require("./store-json");
const pLimit = require("p-limit");

const testUrl = "https://www.reed.co.uk/jobs/test-engineer/48842861";

async function scrapeDescription(url, id) {
  try {
    console.log("Scraping Job ID: " + id);
    // Make a GET request to the job listing URL
    const response = await axios.get(url);

    // Load the HTML body of the page into Cheerio
    const $ = cheerio.load(response.data);

    // Select the element containing the text description
    const descriptionElement = $("*[itemprop = 'description']");

    // Extract the text from the element
    const description = descriptionElement.text();

    // Return the description
    return { description, id };
  } catch (error) {
    console.error(error);
  }
}
async function scrapePostingDescriptions(loadWord) {
  let listings = loadFromFile(loadWord);
  const saveWord = loadWord;

  console.log("Existing listings: " + Object.keys(listings.results).length);

  let saveObj = loadFromFile(saveWord);
  if (saveObj.meta === undefined) {
    saveObj.meta = {
      searchTerm: loadWord,
      descriptionSeen: {},
    };
  }

  const scrapeUrls = [];
  for (jobId in listings.results) {
    if (jobId in saveObj.meta.descriptionSeen) continue;
    const listingUrl = listings.results[jobId].jobUrl;
    const promiseData = { listingUrl, jobId };
    scrapeUrls.push(promiseData);
  }

  const limit = pLimit(1);
  let scrapePromises = scrapeUrls.map((scrapeObj) => {
    return limit(() =>
      scrapeDescription(scrapeObj.listingUrl, scrapeObj.jobId)
    );
  });

  let scrapeResults = [];
  scrapeResults = await Promise.all(scrapePromises);

  // Save the successfully resolved promises to saveObj
  for (let i = 0; i < scrapeResults.length; i++) {
    const scrapeResult = scrapeResults[i];
    if (scrapeResult === undefined) continue;

    const jobId = scrapeResult.id;
    const newObj = listings.results[jobId];

    newObj.jobDescription = scrapeResult.description;

    saveObj.results[jobId] = newObj;
    saveObj.meta.descriptionSeen[jobId] = true;
  }

  saveToFile(saveObj, saveWord);
}

module.exports.default = scrapePostingDescriptions;
