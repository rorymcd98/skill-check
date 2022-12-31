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


  const testArray = [
    '35514697', '37002047', '40092988', '40217529', '40265139',
    '40266072', '40266075', '40479441', '40564903', '40607324',
    '40633574', '40670670', '40679983', '40981569', '41136168',
    '41137643', '41138116', '41138311', '41158377', '41184147',
    '41191358', '41206591', '41243832', '41247014', '41247015',
    '41353455', '41359152', '41390867', '41390887', '41390928',
    '41390943', '41406362', '41529609', '41530274', '41619962',
    '41634212', '41634229', '41634230', '41634311', '41634315',
    '41634319', '41634320', '41634322', '41634323', '41634324',
    '41634325', '41634327', '41634330', '41634342', '41634373',
    '41634555', '41634557', '41634558', '41634559', '41634570',
    '41634596', '41634597', '41634598', '41634600', '41634601',
    '41634602', '41634603', '41634604', '41634606', '41634607',
    '41634608', '41634609', '41634611', '41634612', '41634615',
    '41634618', '41634679', '41634702', '41634773', '41634774',
    '41634775', '41635184', '41682937', '41693772', '41693773',
    '41693798', '41693815', '41693935', '41693949', '41693952',
    '41693953', '41693954', '41693957', '41693961', '41693962',
    '41693964', '41693967', '41693970', '41693972', '41693973',
    '41693976', '41693977', '41693980', '41693981', '41693984'];


  const scrapeUrls = [];
  // for (jobId in listings.results){
  for (jobId in testArray){
    if(jobId in saveObj.meta.descriptionSeen) continue;
    const listingUrl = listings[jobId].jobUrl;
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