const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/sync");
const stringify = require("csv-stringify/sync");

const {
  markMessageSent,
  markMessageError,
  incrementMessagesSent,
  incrementErrorCount,
} = require("./fileUpdater");

async function startSalesBot(folderName, loginData, isAborted) {
  console.log(`🚀 Running bot for folder: ${folderName}`);

  // Load member data
  const data = getMembersData(folderName);
  if (!data || data.length === 0) {
    console.log("⚠️ No member data found — exiting bot.");
    return;
  }

  const infoPath = path.join(
    __dirname,
    "..",
    "python",
    "csv-data",
    folderName,
    "info.json"
  );
  const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

  // Launch browser
  const browser = await puppeteer.launch({
    headless: loginData.headless ?? false,
  });
  const page = await browser.newPage();

  await page.goto("https://login.gymsales.net");

  await page.type("#user_email", loginData.username);
  await page.type("#user_password", loginData.password);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.$eval("button", (button) => {
      if (button.innerText.includes("Sign In")) button.click();
    }),
  ]);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < data.length; i++) {
    if (isAborted && isAborted()) {
      console.log("🚨 Bot aborted.");
      await browser.close();
      break;
    }

    const person = data[i];
    const id = person.id;
    const url = `https://login.gymsales.net/people/${id}`;
    console.log(`➡️ Navigating to: ${url}`);

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
      await wait(3000); // Small buffer

      // Open SMS modal
      await page.evaluate(() => {
        const el = document.querySelector("a.add-sms");
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "center" });
          el.click();
        }
      });

      await page.waitForSelector("#text", { visible: true, timeout: 5000 });
      await page.type("#text", info.message);

      await page.click('button[data-form-button="primary"]');

      markMessageSent(folderName, id);
      incrementMessagesSent(folderName);

      // Log progress
      const percent = Math.round(((i + 1) / data.length) * 100);
      console.log(
        `✅ Sent to ID ${id} (${i + 1}/${data.length}) — ${percent}% done.`
      );
    } catch (err) {
      console.error(`❌ Error on ID ${id}:`, err.message);
      markMessageError(folderName, id);
      incrementErrorCount(folderName);
    }
  }

  await page.waitForTimeout(1500);
  await browser.close();
  console.log("🎉 Bot finished.");
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

  const filtered = records.filter((row) => {
    const val = String(row.message_sent).toLowerCase();
    return val !== "true" && val !== "false";
  });

  // Optionally overwrite the file to clean out sent ones
  const output = stringify.stringify(filtered, { header: true });
  fs.writeFileSync(dataPath, output, "utf8");

  return filtered; // only unsent records
}

module.exports = { startSalesBot };
