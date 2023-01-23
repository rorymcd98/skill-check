const axios = require('axios');
const cheerio = require('cheerio');
const {saveToFile, loadFromFile} = require('./store-json');
const pLimit = require('p-limit');

const testUrl = "https://www.reed.co.uk/jobs/test-engineer/48842861"

main("software")

async function scrapeDescription(url, id) {
  try {
    console.log(id)
    // Make a GET request to the job listing URL
    const response = await axios.get(url);

    // Load the HTML body of the page into Cheerio
    const $ = cheerio.load(response.data);

    // Select the element containing the text description
    const descriptionElement = $("*[itemprop = 'description']");

    // Extract the text from the element
    const description = descriptionElement.text();

    // Return the description
    return {description, id};
  } catch (error) {
    console.error(error);
  }
}

async function main(loadWord){
  let listings = loadFromFile(loadWord);
  console.log(Object.keys(listings))
  const saveWord = "description " + loadWord;

  let saveObj = loadFromFile(saveWord);
  if(saveObj.meta === undefined){
      saveObj = {
        results: {},
        meta: {descriptionSeen: {}}
    }
  }

  const scrapeUrls = [];
  for (jobId in listings.results){
    if(jobId in saveObj.meta.descriptionSeen) continue;
    const listingUrl = listings.results[jobId].jobUrl;
    const promiseData = {listingUrl, jobId};
    scrapeUrls.push(promiseData);
  }

  const limit = pLimit(2);
  let scrapePromises = scrapeUrls.map((scrapeObj)=>{
    return limit(()=> scrapeDescription(scrapeObj.listingUrl, scrapeObj.jobId))
  })

  let scrapeResults = [];
  scrapeResults = await Promise.all(scrapePromises);

  // Save the successfully resolved promises to saveObj
  for (let i = 0; i < scrapeResults.length; i++) {
      const scrapeResult = scrapeResults[i];
      if(scrapeResult === undefined) continue;
      const jobId = scrapeResult.id;
      const newObj = listings[jobId];
      newObj.jobDescription = scrapeResult.description;
      
      saveObj.results[jobId] = newObj; 
      saveObj.meta.descriptionSeen[jobId] = true;
  }

  saveToFile(saveObj, saveWord)
}