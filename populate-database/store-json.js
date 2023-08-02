const fs = require("fs");
const path = require("path");

function saveToFile(obj, saveWord) {
  const fileName = saveWord + ".json";
  const savePath = path.resolve(__dirname, "saved-searches", fileName);

  const objString = JSON.stringify(obj);

  //Check if the savepath exists - if not, create it
  if (!fs.existsSync(path.resolve(__dirname, "saved-searches"))) {
    fs.mkdirSync(path.resolve(__dirname, "saved-searches"));
  }

  fs.writeFileSync(savePath, objString, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Saved to:" + savePath);
  });
}

function loadFromFile(loadWord) {
  const loadPath = path.resolve(
    __dirname,
    "saved-searches",
    loadWord + ".json"
  );
  let obj = {};
  try {
    const jsonString = fs.readFileSync(loadPath, "utf8");
    obj = JSON.parse(jsonString);
    console.log("Loaded file: " + loadPath);
  } catch {
    console.log("There was an error, returning empty object.");
  }
  return obj;
}

module.exports = { saveToFile, loadFromFile };
