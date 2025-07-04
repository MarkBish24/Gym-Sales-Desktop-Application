const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/sync");

async function startSalesBot(folderName, loginData) {
  // get files
  console.log(`Running bot for folder: ${folderName}`);

  const data = getMembersData(folderName);

  const infoPath = path.join(
    __dirname,
    "..",
    "python",
    "csv-data",
    folderName,
    "info.json"
  );

  const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

  // open browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://login.gymsales.net");

  await page.type("#user_email", loginData.username);
  await page.type("#user_password", loginData.password);

  await page.$eval("button", (button) => {
    if (button.innerText.includes("Sign In")) {
      button.click();
    }
  });

  await page.goto(`https://login.gymsales.net/people/`);

  await page.waitForTimeout(3000);
  await browser.close();
  console.log("Bot finished.");
}

function getMembersData(folderName) {
  const dataPath = path.join(
    __dirname,
    "..",
    "python",
    "csv-data",
    folderName,
    "members.csv"
  );
  const csvRaw = fs.readFileSync(dataPath, "utf8");
  const records = parse.parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records;
}

module.exports = { startSalesBot };
