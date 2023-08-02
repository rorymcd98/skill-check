const { default: storeApiUrls } = require("./api-urls");
const { default: populatePostgresDatabase } = require("./populate-database");
const { default: scrapePostingDescriptions } = require("./scrape-postings");

const searchTerm = "software";
const saveWord = "software";

main();
async function main() {
  await storeApiUrls(searchTerm, saveWord);
  await scrapePostingDescriptions(saveWord);
  await populatePostgresDatabase(saveWord);
}
